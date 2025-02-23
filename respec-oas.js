function getEndpoint({apis, path}) {
  let endpoint = {
    post: {
      summary: 'Error: API Endpoint not defined - ' + path
    }
  };

  for(const api of apis) {
    if(api.paths[path] !== undefined) {
      endpoint = api.paths[path];
    }
  }

  return endpoint;
}

function buildComponentTables({config, document, apis}) {
  const apiTables = document.querySelectorAll("table.api-component-table");

  // process every table
  for(const table of apiTables) {
    // set up the API component table headers
    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = '<th>Endpoint</th><th>Expected Caller</th>';
    table.appendChild(tableHeader);

    // summarize each API endpoint
    for(const path of table.dataset.apiPath.split(/\s+/)) {
      if(path.trim().length > 0) {
        const endpoint = getEndpoint({apis, path});
        for(const verb in endpoint) {
          var expectedCaller = endpoint[verb]['x-expectedCaller'];
          const tableRow = document.createElement('tr');
          if(expectedCaller === undefined)
          {
            expectedCaller = "Expected Caller Undefined";;
          }
          tableRow.innerHTML =
            `<td>${verb.toUpperCase()}&nbsp;${path}</td><td>${expectedCaller}</td>`;
          table.appendChild(tableRow);
        }
      }
    }
  }
}

function buildApiSummaryTables({config, document, apis}) {
  const apiTables = document.querySelectorAll("table.api-summary-table");

  // process every table
  for(const table of apiTables) {
    // set up the API summary table headers
    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = '<th>Endpoint</th><th>Description</th>';
    table.appendChild(tableHeader);

    // summarize each API endpoint
    for(const path of table.dataset.apiPath.split(/\s+/)) {
      if(path.trim().length > 0) {
        const endpoint = getEndpoint({apis, path});
        for(const verb in endpoint) {
          const {summary} = endpoint[verb];
          const tableRow = document.createElement('tr');
          tableRow.innerHTML =
            `<td>${verb.toUpperCase()}&nbsp;${path}</td><td>${summary}</td>`;
          table.appendChild(tableRow);
        }
      }
    }
  }
}

function buildEndpointDetails({config, document, apis}) {
  const apiDetailSections = document.querySelectorAll(".api-detail");

  // process every detail section
  for(const section of apiDetailSections) {
    // detail each API endpoint
    const [verb, path] = section.dataset.apiEndpoint.split(/\s+/);
    const endpoint = getEndpoint({apis, path})[verb];

    // summary for endpoint
    const summary = document.createElement('p');
    summary.innerHTML =
      verb.toUpperCase() + ' ' + path + ' - ' + endpoint.summary;
    section.appendChild(summary);

    // schema for endpoint
    if(endpoint.requestBody) {
      const contentTypes = Object.keys(endpoint.requestBody.content);

      for(const contentType of contentTypes) {
        const requestSchema =
          endpoint.requestBody.content[contentType].schema.properties ||
          endpoint.requestBody.content[contentType].schema;

        const schemaSummary = document.createElement('p');
        if(requestSchema.anyOf) {
          schemaSummary.innerHTML += `The ${path} endpoint uses any of ` +
          `the following schemas when receiving a `;
        } else {
          schemaSummary.innerHTML += `The ${path} endpoint uses ` +
          `the following schema when receiving a `;
        }
        schemaSummary.innerHTML += `${verb.toUpperCase()} `;
        schemaSummary.innerHTML += `with content-type header ` +
          `set to ${contentType}:`;
        section.appendChild(schemaSummary);

        let requestSchemaHtml = document.createElement('p');
        if(requestSchema) {
          if(requestSchema.anyOf) {
            for(const i in requestSchema.anyOf) {
              const anySchema = requestSchema.anyOf[i];
              const schema = anySchema.properties || anySchema;
              requestSchemaHtml = renderJsonSchema(schema);
              section.appendChild(requestSchemaHtml);
              if(i + 1 < requestSchema.anyOf.length) {
                const nextSchemaSummary = document.createElement('p');
                nextSchemaSummary.innerHTML = `Alternatively, the ${path} ` +
                `endpoint can also use the following schema:`;
                section.appendChild(nextSchemaSummary);
              }
            }
          } else {
            requestSchemaHtml = renderJsonSchema(requestSchema);
            section.appendChild(requestSchemaHtml);
          }
        } else {
          requestSchemaHtml.innerHTML = 'RENDERING ERROR'; // default
          section.appendChild(requestSchemaHtml);
        }
      }
    }

    // responses for endpoint
    const responsesSummary = document.createElement('p');
    responsesSummary.innerHTML = `The ${path} endpoint can result ` +
      `in any of these responses when receiving a ${verb.toUpperCase()}:`;
    section.appendChild(responsesSummary);
    const responsesTable = buildResponsesTable(endpoint);
    section.appendChild(responsesTable);
  }
}

/**
 * Builds the responses table for an endpoint.
 *
 * @param {object} endpoint - An endpoint object.
 *
 * @returns {HTMLElement} A responses a table.
 */
function buildResponsesTable(endpoint) {
  // responses for endpoint
  const responsesTable = document.createElement('table');
  responsesTable.setAttribute('class', 'simple');
  responsesTable.innerHTML = '<tr><th>Response</th><th>Description</th><th>Body</th></tr>';
  for(const response in endpoint.responses) {
    const responseDetail = endpoint.responses[response];
    const {description, content} = responseDetail;
    const responseSchema = getResponseBodySchema(content);
    const row = document.createElement('tr');
    row.appendChild(textEl({text: response}));
    row.appendChild(textEl({text: description}));
    const data3 = document.createElement('td');
    data3.appendChild(responseSchema);
    row.appendChild(data3);
    responsesTable.appendChild(row);
  }
  return responsesTable;
}

/**
 * Takes in a response's content object and renders any schema found.
 *
 * @param {object} [content] - Response content.
 *
 * @returns {HTMLElement} An HTML element.
 */
function getResponseBodySchema(content) {
  if(!content) {
    return document.createElement('span');
  }
  const section = document.createElement('section');
  section.style['font-size'] = '0.75rem';
  return Object.entries(content).reduce((combined, [contentType, {schema}]) => {
    combined.appendChild(textEl({el: 'i', text: `content-type: ${contentType}`}));
    combined.appendChild(document.createElement('br'));
    if(schema) {
      const _el = document.createElement('td');
      if(schema?.type === 'array') {
        _el.innerHTML = 'Each item in the array MUST be ';
        _el.innerHTML += renderJsonSchemaObject(schema.items);
      } else {
        _el.innerHTML = renderJsonSchemaObject(schema);
      }
      combined.appendChild(_el);
    }
    return combined;
  }, section);
}

/**
 * Takes in text and create an element with that textContent.
 *
 * @param {object} options - Options to use.
 * @param {string} [options.el='td'] - An element type.
 * @param {string} options.text - Text content for an element.
 *
 * @returns {object} An html element.
 */
function textEl({el = 'td', text}) {
  const _el = document.createElement(el);
  _el.textContent = text;
  return _el;
}

function renderJsonSchema(schema) {
  const schemaToRender = schema;
  const requestSchemaTable = document.createElement('table');
  const tableHeader = document.createElement('thead');
  const tableBody = document.createElement('tbody');

  requestSchemaTable.classList.add('simple');
  tableHeader.innerHTML = '<tr><th>Property</th><th>Description</th></tr>';

  // render every property in the complex schema
  for(const property in schemaToRender) {
    if(property === 'example') {
      continue;
    }
    const subSchema = schema[property];
    let propertyRendering = `<code>${property}</code>`;
    let valueRendering = 'Error: JSON Schema value rendering failure.'; // default
    if(subSchema.type === 'object') {
      propertyRendering = `<code>${property}</code> [object]`;
      valueRendering = renderJsonSchemaObject(subSchema);
    } else if(Array.isArray(subSchema)) {
      for(const i in subSchema) {
        const schemaItem = subSchema[i];
        if(i < 1) {
          valueRendering = '';
        } else if(property === 'allOf') {
          propertyRendering = 'All of';
          valueRendering += ' and ';
        } else {
          propertyRendering = 'Any of';
          valueRendering += ' or ';
        }
        valueRendering += renderJsonSchemaObject(schemaItem);
      }
    } else {
      valueRendering = '<pre>' + JSON.stringify(subSchema, null, 2) + '</pre>';
    }
    tableBody.innerHTML +=
      `<tr><td style='vertical-align: top;'>${propertyRendering}</td>` +
      `<td>${valueRendering}</td></tr>`;
  }

  requestSchemaTable.appendChild(tableHeader);
  requestSchemaTable.appendChild(tableBody);

  return requestSchemaTable;
}

function renderJsonSchemaObject(schema) {
  let objectRendering = '';
  if(schema.anyOf) {
    let collectedSchemas = '';
    for(const index in schema.anyOf) {
      const item = schema.anyOf[index];
      collectedSchemas += renderJsonSchemaObject(item);
      // if there are more items in anyOf add an or
      if((index + 1) < schema.anyOf.length) {
        collectedSchemas += ' or ';
      }
    }
    return collectedSchemas;
  }
  if(schema.allOf) {
    const mergedSchema = {
      type: 'object',
      properties: {}
    };
    for(item of schema.allOf) {
      for(property in item.properties) {
        mergedSchema.properties[property] = item.properties[property];
      }
    }

    objectRendering = renderJsonSchemaObject(mergedSchema);
  } else if(schema.oneOf) {
    objectRendering += ' either ';
    let itemCount = 0;
    for(const item of schema.oneOf) {
      if(item.type === 'string') {
        objectRendering += 'a string';
      } else if(item.type === 'object') {
        objectRendering += renderJsonSchemaObject(item);
      } else if(item.type === 'array') {
        objectRendering += 'an array';
        if(item.items) {
          objectRendering += ` of ${item.items.type}(s)`;
        }
      }

      itemCount += 1;
      if(itemCount < schema.oneOf.length) {
        objectRendering += ' or ';
      }
    }
  } else if(schema.type === 'object') {
    if(!schema.properties) {
      if(schema.description) {
        objectRendering = schema.description.replace(/\.$/, "") +
          ' (an object)';
      } else {
        objectRendering = 'an object';
      }
    } else {
      objectRendering += 'an object of the following form: <dl>';
      for(const property in schema.properties) {
        const value = schema.properties[property];
        objectRendering += renderJsonSchemaProperty(property, value);
      }
      objectRendering += '</dl>';
    }
  } else {
    objectRendering = '<pre>' + JSON.stringify(schema, null, 2) + '</pre>';
  }

  return objectRendering;
}

function renderJsonSchemaProperty(property, value) {
  let propertyRendering = `<dt><code>${property}</code> [${value.type}]</dt>`;
  propertyRendering += '<dd>' + value.description + ' ' +
    renderJsonSchemaValue(property, value) + '</dd>';

  return propertyRendering;
}

function renderJsonSchemaValue(property, value) {
  let valueRendering = '';

  if(value.type === 'array') {
    valueRendering = `Each item in the <code>${property}</code> array MUST be `;
    if(value.items.type === 'object') {
      valueRendering += 'an object of the following form:';
      //typeDetails += renderJsonSchemaValue(property, value);
    } else if(value.items.type === 'string') {
      valueRendering += 'a string.';
    } else {
      valueRendering += `a ${value.items.type}:`;
    }
  } else if(value.type === 'object') {
    valueRendering =
      `The <code>${property}</code> object MUST be `;
    valueRendering += renderJsonSchemaObject(value);
  } else if(value.type === 'string' || value.type === 'boolean') {
    // no-op
  } else {
    valueRendering = '<pre>' + JSON.stringify(value, null, 2) + '</pre>';
  }

  return valueRendering;
}

async function injectOas(config, document) {
  try {
    const issuerApi = await SwaggerParser.validate('issuer.yml');
    console.log('API name: %s, Version: %s',
      issuerApi.info.title, issuerApi.info.version);
    const exchangesApi = await SwaggerParser.validate('exchanges.yml');
    console.log('API name: %s, Version: %s',
      exchangesApi.info.title, exchangesApi.info.version);
    const verifierApi = await SwaggerParser.validate('verifier.yml');
    console.log('API name: %s, Version: %s',
      verifierApi.info.title, verifierApi.info.version);
    const holderApi = await SwaggerParser.validate('holder.yml');
    console.log('API name: %s, Version: %s',
      holderApi.info.title, holderApi.info.version);
    const apis = [issuerApi, verifierApi, holderApi, exchangesApi];

    buildApiSummaryTables({config, document, apis});
    buildEndpointDetails({config, document, apis});
    buildComponentTables({config, document, apis});
  } catch(err) {
    console.error(err);
  }
}
