{
  "nodes": [
    {
      "parameters": {
        "amount": 1
      },
      "id": "81ef8dc7-cbe0-4124-9a06-3f7e7d30cf02",
      "name": "Wait",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        5424,
        -1968
      ],
      "webhookId": "9494b82f-0ec0-4900-91fd-b4452623f7c1"
    },
    {
      "parameters": {
        "content": "",
        "height": 500,
        "width": 1060,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        4576,
        -2224
      ],
      "typeVersion": 1,
      "id": "7ee184c0-468e-45de-b4ac-5a9ae6b01cd4",
      "name": "Sticky Note1"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        4912,
        -1984
      ],
      "id": "cf364da3-35da-4c4a-bc32-dbd843892411",
      "name": "Loop Messages"
    },
    {
      "parameters": {
        "content": "",
        "height": 1008,
        "width": 1312,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        3040,
        -2224
      ],
      "typeVersion": 1,
      "id": "ac27f83e-53b9-40bd-9fbe-c281983c33b4",
      "name": "Sticky Note2"
    },
    {
      "parameters": {
        "model": "gpt-4.1-mini",
        "options": {
          "temperature": 0.7
        }
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1,
      "position": [
        3136,
        -1616
      ],
      "id": "5f25bdc7-e405-4fcb-b2a3-2320081afc1e",
      "name": "OpenAI Chat Model",
      "credentials": {
        "openAiApi": {
          "id": "miqkTTbtvpvRoFjN",
          "name": "Hub - IA"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "// Obtém a saída do nó \"Humanizador\"\nlet output = $input.first().json.output\n\n// Limpeza e substituições\noutput = output\n  .replace(/\\\\n\\\\n\\\\n/g, '\\n\\n') // Reduz múltiplos \\n\n  .replace(/\\\\n\\\\n/g, '\\n\\n')\n  .replace(/\\\\n/g, '\\n')\n  .replace(/\\n\\s*!\\[.*?\\]\\((https?:\\/\\/.*?)\\)/g, '\\n$1') // Extrai apenas a URL da imagem\n  .replace(/\\*\\*/g, '|') // Troca ** por marcador temporário\n  .replace(/\\*/g, '_') // Troca * por _\n  .replace(/\\|/g, '*') // Volta | para *\n  .replace(/\\\"/g, '\\\\\"'); // Escapa aspas duplas\n\n// Quebra o texto por duplas de nova linha ou links de imagem\nconst splitOutput = output\n  .split(/(?=\\n\\n|http[s]?:\\/\\/[^\\s]+?\\.(?:jpeg|jpg|png|webp))/gi)\n  .map(item => item.trim())\n  .filter(item => item.length > 0);\n\n// Função para limpar títulos e negrito restantes\nfunction cleanText(text) {\n  return text\n    .replace(/^#+\\s*/gm, '') // Remove títulos tipo ## ou ###\n    .replace(/\\*(.*?)\\*/g, '$1') // Remove _itálico_ ou *negrito*\n    .replace(/_(.*?)_/g, '$1');  // Remove underlines também\n}\n\n// Retorna como array de objetos\nreturn splitOutput.map(part => ({\n  result: cleanText(part)\n}));\n"
      },
      "id": "281d57e7-290f-4c92-9eef-6c972904c046",
      "name": "Split",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        4704,
        -1984
      ]
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "acertai",
        "options": {}
      },
      "id": "2764bef4-ec16-4427-83ef-b438985be158",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [
        976,
        -2816
      ],
      "webhookId": "db4280a8-2cec-4259-a5ae-077124921e69"
    },
    {
      "parameters": {
        "content": "",
        "height": 300,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        880,
        -2944
      ],
      "id": "ed03af9a-c2ab-4fb4-94d7-4bae817ad5ac",
      "name": "Sticky Note5"
    },
    {
      "parameters": {
        "content": "",
        "height": 300,
        "width": 260,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        1200,
        -2928
      ],
      "id": "d4639f0f-3832-4898-8e82-9ef1dfc298a1",
      "name": "Sticky Note6"
    },
    {
      "parameters": {
        "resource": "image",
        "operation": "analyze",
        "modelId": {
          "__rl": true,
          "value": "gpt-4o-mini",
          "mode": "list",
          "cachedResultName": "GPT-4O-MINI"
        },
        "text": "=Você é um analista financeiro, com larga experiência em consultoria de finanças familiares.\n\nAnalise este comprovante financeiro e extraia as seguintes informações em formato JSON:\n\n{\n  \"tipo\": \"receita\" ou \"despesa\",\n  \"descricao\": \"descrição clara da transação\",\n  \"valor\": número (apenas o valor numérico, sem símbolos),\n  \"categoria\": \"categoria apropriada (Veja abaixo as categorias disponíveis)\",\n  \"data\": \"data no formato YYYY-MM-DD\"\n}\n\n### Despesas\n\n- **Alimentação**: comida, restaurante, mercado, lanche, almoço, jantar, café\n- **Transporte**: gasolina, combustível, uber, táxi, ônibus, metrô, estacionamento\n- **Moradia**: aluguel, condomínio, luz, água, gás, internet, iptu\n- **Saúde**: médico, consulta, remédio, farmácia, exame, dentista\n- **Educação**: escola, faculdade, curso, livro, material\n- **Lazer**: cinema, show, viagem, festa, jogos, streaming, spotify, netflix\n- **Roupas**: roupa, calçado, tênis, camisa, calça, vestido\n- **Tecnologia**: celular, computador, software, app, hardware\n- **Serviços**: assinatura, manutenção, limpeza, conserto\n- **Outros**: demais gastos\n\n### Receitas\n\n- **Salário**: pagamento, salário, contracheque, folha\n- **Freelance**: freela, freelance, projeto, consultoria\n- **Investimentos**: dividendos, juros, rendimento, aplicação\n- **Vendas**: venda, produto, comissão\n- **Aluguel Recebido**: aluguel recebido, locação, arrendamento\n- **Outros**: demais receitas\n\nRegras importantes:\n- Se for uma nota fiscal de compra/pagamento = \"despesa\"\n- Se for um comprovante de pagamento recebido/depósito = \"receita\"\n- Para o valor, extraia apenas números (ex: se vê \"R$ 150,50\", retorne 150.5)\n- Para categoria, use termos como: Alimentação, Transporte, Saúde, Educação, Lazer, Moradia, Salário, Freelance, Vendas e etc...\n- Para data, tente extrair a data da transação, não a data de emissão\n- Seja preciso na classificação entre receita e despesa\n\nResponda APENAS com o JSON, sem explicações adicionais.",
        "inputType": "=data",
        "simplify": false,
        "options": {}
      },
      "id": "dc307e05-5066-41ea-af6b-64512b8de462",
      "name": "Analisa Imagem",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.4,
      "position": [
        3872,
        -3024
      ],
      "credentials": {
        "openAiApi": {
          "id": "miqkTTbtvpvRoFjN",
          "name": "Hub - IA"
        }
      }
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "leftValue": "={{ $('Webhook').item.json.body.data.messageType }}",
                    "rightValue": "conversation",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    },
                    "id": "4765207e-26a9-478c-94a8-2db13b31ef65"
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "texto"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "eff21590-3f98-44e7-a61c-69b58659b264",
                    "leftValue": "={{ $('Webhook').item.json.body.data.messageType }}",
                    "rightValue": "audioMessage",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "audio"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "70387fe0-1775-4220-8d33-31a51169cd39",
                    "leftValue": "={{ $('Webhook').item.json.body.data.messageType }}",
                    "rightValue": "imageMessage",
                    "operator": {
                      "type": "string",
                      "operation": "equals",
                      "name": "filter.operator.equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "image"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "003fa31f-1448-443d-8c59-8f36cb06ff73",
                    "leftValue": "={{ $('Webhook').item.json.body.data.messageType }}",
                    "rightValue": "=documentMessage",
                    "operator": {
                      "type": "string",
                      "operation": "equals",
                      "name": "filter.operator.equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "documento"
            }
          ]
        },
        "options": {}
      },
      "id": "35258a13-9e34-4d60-9c79-a49c294d0ca3",
      "name": "Switch messageType",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.2,
      "position": [
        3136,
        -2880
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "98cb7ff6-269e-40f0-9ca3-779b426b5dab",
              "name": "remoteJid",
              "value": "={{ $('Webhook').item.json.body.data.key.remoteJid }}",
              "type": "string"
            },
            {
              "id": "2a9dbe4e-92e9-4d7d-9d5e-277b34c5736e",
              "name": "mensagem",
              "value": "={{ $('Webhook').item.json.body.data.message.conversation }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "3814b53c-20f2-4d53-86a6-99c2982bde2a",
      "name": "Texto",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3520,
        -3632
      ]
    },
    {
      "parameters": {
        "resource": "audio",
        "operation": "transcribe",
        "binaryPropertyName": "=data",
        "options": {}
      },
      "id": "44bd2860-db32-4510-91e8-7016ec7c461a",
      "name": "Transcreve Áudio",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.4,
      "position": [
        3856,
        -3440
      ],
      "credentials": {
        "openAiApi": {
          "id": "miqkTTbtvpvRoFjN",
          "name": "Hub - IA"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "a7322056-3060-4893-9d0d-13f49560c27c",
              "name": "remoteJid",
              "value": "={{ $('Definições Globais').item.json.remoteJid }}",
              "type": "string"
            },
            {
              "id": "424c7671-5250-4bf2-aa56-d12759837522",
              "name": "mensagem",
              "value": "={{ $item(\"0\").$node[\"Transcreve Áudio\"].json[\"text\"] }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "a039793a-cfc5-4236-8986-55d313b47398",
      "name": "Transcrição",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        4016,
        -3440
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "a7322056-3060-4893-9d0d-13f49560c27c",
              "name": "remoteJid",
              "value": "={{ $('Definições Globais').item.json.remoteJid }}",
              "type": "string"
            },
            {
              "id": "424c7671-5250-4bf2-aa56-d12759837522",
              "name": "mensagem",
              "value": "={{ $item(\"0\").$node[\"Analisa Imagem\"].json[\"choices\"][\"0\"][\"message\"][\"content\"] }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "ac7d9aef-1711-4764-bfa6-b0981b20887e",
      "name": "Imagem Analisada",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        4032,
        -3024
      ]
    },
    {
      "parameters": {
        "content": "",
        "height": 1264,
        "width": 1520,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        3040,
        -3744
      ],
      "typeVersion": 1,
      "id": "3f1b6ed7-8b39-4a34-b865-e5ac2fb54441",
      "name": "Sticky Note8"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "8a9e3cf8-ed81-432f-97ed-3e313dda6117",
              "name": "remoteJid",
              "value": "={{ \n  $item(\"0\").$node[\"Webhook\"].json[\"body\"][\"data\"][\"key\"][\"remoteJid\"]\n    .toString()\n    .replace(/@s\\.whatsapp\\.net$/, '')\n    .replace(/^55(\\d{2})(\\d{5})(\\d{4})$/, '$1 $2$3')\n}}",
              "type": "string"
            },
            {
              "id": "c462d894-872e-4dfa-93f8-f5473ba0a874",
              "name": "pushName",
              "value": "={{ $item(\"0\").$node[\"Webhook\"].json[\"body\"][\"data\"][\"pushName\"] }}",
              "type": "string"
            },
            {
              "id": "8f1dd78d-2cdf-4ccd-93de-f1f9fcf05242",
              "name": "conversation",
              "value": "={{ $item(\"0\").$node[\"Webhook\"].json[\"body\"][\"data\"][\"message\"][\"conversation\"] }}",
              "type": "string"
            },
            {
              "id": "52a755db-c4a7-40ed-adb8-db8783fac6ca",
              "name": "messageType",
              "value": "={{ $item(\"0\").$node[\"Webhook\"].json[\"body\"][\"data\"][\"messageType\"] }}",
              "type": "string"
            },
            {
              "id": "2bc74008-8683-46cc-af56-74f3f17a8109",
              "name": "fromMe",
              "value": "={{ $item(\"0\").$node[\"Webhook\"].json[\"body\"][\"data\"][\"key\"][\"fromMe\"] }}",
              "type": "string"
            },
            {
              "id": "b45af9ee-b316-4a90-ac1c-2eb9c1c23e1f",
              "name": "base64",
              "value": "={{ $item(\"0\").$node[\"Webhook\"].json[\"body\"][\"data\"][\"message\"][\"base64\"] || $json.body.data.key.id }}",
              "type": "string"
            },
            {
              "id": "35182163-2351-4dfa-baf4-a92bf03bd666",
              "name": "project_id",
              "value": "vfacjktkzackwthtxfgv",
              "type": "string"
            },
            {
              "id": "c5240eba-21f3-45e1-ba82-6e7c6ec6c8ba",
              "name": "authorization",
              "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmYWNqa3RremFja3d0aHR4Zmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTQxMzksImV4cCI6MjA3OTM5MDEzOX0.QX_qz6Kll0YDArVam72WwVp5RNOs9k1WwJSDJmHQ3R4",
              "type": "string"
            },
            {
              "id": "5b7a177f-8652-4a37-bed7-e4b85a0722ab",
              "name": "cadastro",
              "value": "={{ \n  (\n    $json.body.data.key.remoteJid.match(/^\\d+@(s\\.whatsapp\\.net|jid)$/) \n      ? $json.body.data.key.remoteJid \n      : (\n          $json.body.data.key.remoteJidAlt.match(/^\\d+@(s\\.whatsapp\\.net|jid)$/)\n            ? $json.body.data.key.remoteJidAlt\n            : \"\"\n        )\n  )\n  .replace(/^55/, \"\")\n  .replace(/@.*/, \"\")\n  .replace(/^(\\d{2})(\\d{8})$/, \"$1\" + \"9\" + \"$2\")\n}}",
              "type": "string"
            },
            {
              "id": "f69d8701-4838-44e9-9c59-5a70c7d9e5a6",
              "name": "body.data.key.remoteJid",
              "value": "={{ \n  $json.body.data.key.remoteJid.match(/^\\d+@(s\\.whatsapp\\.net|jid)$/) \n  ? $json.body.data.key.remoteJid \n  : (\n      $json.body.data.key.remoteJidAlt.match(/^\\d+@(s\\.whatsapp\\.net|jid)$/) \n      ? $json.body.data.key.remoteJidAlt \n      : \"\"\n    )\n}}",
              "type": "string"
            },
            {
              "id": "b260e2a8-9a51-4c68-971e-4476f120f91a",
              "name": "url_base",
              "value": "={{ $json.body.server_url }}",
              "type": "string"
            },
            {
              "id": "0fd9b21f-6501-4f12-bac1-190362ecef48",
              "name": "instancia",
              "value": "={{ $json.body.instance }}",
              "type": "string"
            },
            {
              "id": "5e0b3dce-c795-413a-a185-aa8279491d46",
              "name": "apikey",
              "value": "={{ $json.body.apikey }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "766539b6-d9cc-42b3-8167-f11dbe41f343",
      "name": "Definições Globais",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1264,
        -2816
      ]
    },
    {
      "parameters": {
        "operation": "push",
        "list": "={{ $json.remoteJid }}",
        "messageData": "={{ $json.mensagem }}",
        "tail": true
      },
      "id": "17b3a90c-bdbf-44cc-bde4-bbb67d72c485",
      "name": "Listar Mensagens",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [
        4976,
        -2832
      ],
      "credentials": {
        "redis": {
          "id": "aR2BJv2aPkhfadVA",
          "name": "Casip Shop - 6"
        }
      }
    },
    {
      "parameters": {
        "operation": "get",
        "propertyName": "mensagem",
        "key": "={{ $json.remoteJid }}",
        "options": {}
      },
      "id": "e1b42e46-80d4-4b8f-a105-624566447994",
      "name": "Puxar as Mensagens",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [
        5408,
        -2832
      ],
      "credentials": {
        "redis": {
          "id": "aR2BJv2aPkhfadVA",
          "name": "Casip Shop - 6"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "8bb80936-87dc-4fcf-9784-83b69bf74de3",
              "leftValue": "={{ $json.mensagem.last() }}",
              "rightValue": "={{ $('Merge').item.json.mensagem }}",
              "operator": {
                "type": "string",
                "operation": "equals",
                "name": "filter.operator.equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "cb471f6a-db20-4dcb-8fe0-7b762180976b",
      "name": "If",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        4992,
        -2544
      ]
    },
    {
      "parameters": {
        "operation": "delete",
        "key": "={{ $json.chat_id }}"
      },
      "id": "0253b120-f087-4b47-b47a-818a2640c3a3",
      "name": "Deleta Mesagem",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [
        5408,
        -2576
      ],
      "credentials": {
        "redis": {
          "id": "aR2BJv2aPkhfadVA",
          "name": "Casip Shop - 6"
        }
      }
    },
    {
      "parameters": {
        "amount": 1.5
      },
      "id": "c728623c-1c30-47b9-b0c7-160b27ed0ea8",
      "name": "Debounce",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        5200,
        -2832
      ],
      "webhookId": "186278e9-129c-4e40-bf58-9bcdbb134c97"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "a8f9df49-3137-42d2-9ac3-dae8a8ea7a26",
              "name": "mensagem",
              "value": "={{ $('Puxar as Mensagens').item.json.mensagem.join('\\n') }}",
              "type": "string"
            },
            {
              "id": "22d5a625-8475-4115-9982-2b4911663125",
              "name": "chat_id",
              "value": "={{ $('Merge').item.json.remoteJid }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "4d525979-1d48-4d8b-b0d9-693f7337dc71",
      "name": "Fragmenta",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        5216,
        -2576
      ]
    },
    {
      "parameters": {
        "content": "",
        "height": 640,
        "width": 840,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        4832,
        -2960
      ],
      "typeVersion": 1,
      "id": "95d2d2e8-1017-4a1a-848e-ad35571138a6",
      "name": "Sticky Note9"
    },
    {
      "parameters": {
        "numberInputs": 6
      },
      "id": "bd375ba8-a568-429e-86a4-515b1bbd0c87",
      "name": "Merge",
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3,
      "position": [
        4368,
        -3168
      ]
    },
    {
      "parameters": {
        "content": "# IDENTIFICADOR TIPO DE MENSAGEM",
        "height": 80,
        "width": 676,
        "color": 5
      },
      "id": "5ecf1247-bdb4-40fc-802c-910405661e50",
      "name": "Sticky Note47",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        3040,
        -3792
      ]
    },
    {
      "parameters": {
        "content": "# DEBOUNCE",
        "height": 80,
        "width": 236,
        "color": 5
      },
      "id": "6f447a96-bfa3-4dba-a11e-556c04e907f8",
      "name": "Sticky Note48",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        4816,
        -2976
      ]
    },
    {
      "parameters": {
        "content": "# ASSISTENTE VIRTUAL",
        "height": 80,
        "width": 416,
        "color": 5
      },
      "id": "e83f805e-a694-4f66-8881-d72a6e841cc1",
      "name": "Sticky Note50",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        3008,
        -2256
      ]
    },
    {
      "parameters": {
        "content": "# EVOLUTION API",
        "height": 80,
        "width": 316,
        "color": 5
      },
      "id": "b1664b10-f806-4246-824e-073a09eb8325",
      "name": "Sticky Note51",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        4560,
        -2256
      ]
    },
    {
      "parameters": {
        "content": "# DEFINIÇÕES",
        "height": 80,
        "width": 236,
        "color": 5
      },
      "id": "e6ba8911-4a1d-4aee-aa5d-be2083a993b7",
      "name": "Sticky Note53",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        1184,
        -2960
      ]
    },
    {
      "parameters": {
        "content": "# WEBHOOK",
        "height": 80,
        "width": 216,
        "color": 5
      },
      "id": "6d1ae933-bef6-4d36-b64c-4fb35fa3e88e",
      "name": "Sticky Note54",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        864,
        -2976
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Webhook').item.json.body.server_url }}/message/sendText/{{ $('Webhook').item.json.body.instance }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "ApiKey",
              "value": "={{ $('Webhook').item.json.body.apikey }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "number",
              "value": "={{ $item(\"0\").$node[\"Webhook\"].json[\"body\"][\"data\"][\"key\"][\"remoteJid\"] }}"
            },
            {
              "name": "text",
              "value": "={{ $json.result }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        5184,
        -1968
      ],
      "id": "5bd8a102-fb51-4a32-9d5e-3f8b8d9a97ac",
      "name": "Evolution API"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=Dados do usuário:\nNome: {{ $('consultar_user_id').item.json.name }}\nUser_ID: {{ $('consultar_user_id').item.json.user_id }}\n\nMensagem recebida: {{ $json.mensagem }}",
        "options": {
          "systemMessage": "=# ASSISTENTE FINANCEIRO DIRETO\n\n## CONFIGURAÇÃO DE DATA/TIME\n\n- **Data atual**: {{$now.format('dd/MM/yyyy')}}\n- **Dia da semana**: {{ $now.weekdayLong }}\n- **Horário**: {{ $now.hour.toString().padStart(2, '0') }}:{{ $now.minute.toString().padStart(2, '0') }}\n\n## INSTRUÇÕES PRINCIPAIS\n\nVocê é um assistente financeiro DIRETO e OBJETIVO.\n\n⚠️ REGRAS CRÍTICAS:\n\n1. NUNCA peça confirmação após ter todas as informações necessárias\n2. NUNCA explique seu raciocínio desnecessariamente\n3. APENAS pergunte quando houver AMBIGUIDADE real\n4. REGISTRE e confirme quando tiver certeza\n5. SEMPRE CHAME A TOOL PARA REGISTRAR ALGO, NUNCA INFORME QUE REGISTROU SEM TER CHAMADO\n\n### FLUXO ÚNICO\n\n1. Receba a mensagem\n2. Extraia as informações\n3. **Se houver AMBIGUIDADE**: pergunte objetivamente\n4. **Se tiver todas as informações**: consulte categorias para pegar UUIDs (para despesas/receitas)\n5. Use a tool para salvar com o categoria_id correto (despesas/receitas) ou agende o compromisso\n6. Responda APENAS com a confirmação\n\n### QUANDO PERGUNTAR\n\n✅ **PERGUNTE quando:**\n- Não conseguir identificar se é receita ou despesa (ex: \"Gasolina 50 reais\" - pode ser abastecimento próprio ou venda)\n- Valor ambíguo ou ausente\n- Descrição muito vaga para categorizar\n- Data ausente para compromissos SEM indicadores relativos (ex: \"dentista\" sem \"amanhã\", \"dia X\", etc)\n\n❌ **NÃO PERGUNTE quando:**\n- Houver indicadores claros de tipo (gastei=despesa, recebi=receita)\n- Data for relativa identificável (hoje, amanhã, próxima terça, semana que vem, etc)\n- Categoria for óbvia pelo contexto\n- Valor estiver claro\n- Houver palavras-chave de agendamento com data (marque, agende + indicador de tempo)\n\n### TOOLS DISPONÍVEIS\n\n```typescript\ntool_consultar_categorias({\n  user_id: string,\n  tipo: \"receita\" | \"despesa\",\n});\n\ntool_consultar_despesas({\n  user_id: string,\n  valor: string,\n  data: string, // YYYY-MM-DD\n});\n\ntool_consultar_receitas({\n  user_id: string,\n  valor: string,\n  data: string, // YYYY-MM-DD\n});\n\ntool_salvar_despesas({\n  user_id: string,\n  categoria_id: string, // UUID da categoria (não o nome!)\n  descricao: string,\n  valor: number,\n  data: string, // YYYY-MM-DD\n});\n\ntool_salvar_receitas({\n  user_id: string,\n  categoria_id: string, // UUID da categoria (não o nome!)\n  descricao: string,\n  valor: number,\n  data: string, // YYYY-MM-DD\n});\n\ntool_agendar_compromisso({\n  user_id: string,\n  titulo: string,\n  descricao: string,\n  data: string, // YYYY-MM-DD\n});\n\ntool_consultar_compromisso({\n  user_id: string,\n  data: string, // YYYY-MM-DD\n});\n```\n\n### ⚠️ REGRAS PARA COMPROMISSOS\n\n**SEMPRE chame a tool de compromissos quando:**\n- Houver verbos de agendamento: marque, agende, marcar, agendar, lembre-me, crie lembrete\n- Houver substantivos de evento: compromisso, evento, reunião, consulta, appointment, lembrete\n- Houver contexto temporal sem valor monetário: \"dentista amanhã\", \"reunião terça\", \"consulta dia 15\"\n\n**Fluxo para AGENDAR compromisso:**\n1. Identifique o tipo (compromisso)\n2. Extraia: título, descrição (se houver), data\n3. Calcule a data automaticamente se for relativa\n4. **CHAME tool_agendar_compromisso IMEDIATAMENTE**\n5. Confirme o agendamento\n\n**Fluxo para CONSULTAR compromissos:**\n1. Identifique pedido de consulta com palavras-chave:\n   - Verbos: mostre, liste, veja, quais, consulte, verificar\n   - Substantivos: agendamentos, compromissos, eventos, agenda, calendário\n   - Perguntas: \"o que tenho\", \"o que está marcado\", \"tem algo\"\n2. Determine o período:\n   - **SEM data específica**: consulte os próximos 7 dias (padrão)\n   - **COM data específica**: consulte apenas a data mencionada (hoje, amanhã, segunda, dia 15, etc)\n   - **Período mencionado**: consulte o intervalo (semana, mês, próximos X dias)\n3. **CHAME tool_consultar_compromisso para cada data do período**\n4. Liste os compromissos encontrados de forma organizada por data\n\n**NÃO confunda:**\n- \"Dentista 200 reais\" = DESPESA (tem valor)\n- \"Dentista amanhã\" = COMPROMISSO (sem valor, tem tempo)\n- \"Paguei dentista 200 hoje\" = DESPESA (verbo de gasto + valor)\n- \"Marque dentista para amanhã\" = COMPROMISSO (verbo de agendamento)\n\n### RESPOSTA PADRÃO\n\n**Para despesas/receitas:**\n✅ [Tipo] registrada:\n📝 [descrição]\n💰 R$ [valor]\n🏷️ [categoria]\n\n**Para compromissos:**\n✅ Compromisso agendado:\n📋 [título]\n📅 [data no formato dd/MM/yyyy]\n⏰ [horário, se especificado]\n\n**Para consulta de compromissos:**\n📅 Compromissos - Próximos 7 dias:\n\n**[dia da semana], [dd/MM]:**\n• [título 1] - [horário/descrição]\n• [título 2] - [horário/descrição]\n\n**[dia da semana], [dd/MM]:**\n• [título 3] - [horário/descrição]\n\n(Se nenhum compromisso: \"Nenhum compromisso agendado nos próximos 7 dias\")\n\n### EXEMPLO COM AMBIGUIDADE\n\n**Entrada:** \"Gasolina 50 reais\"\n\n**Resposta:**\n\"É despesa (você abasteceu) ou receita (você vendeu)?\"\n\n**Entrada posterior:** \"Abasteci\"\n\n**Resposta:**\n✅ Despesa registrada:\n📝 Gasolina\n💰 R$ 50,00\n🏷️ Transporte\n\n### EXEMPLOS DE CONSULTA\n\n**Entrada:** \"Quanto gastei esse mês?\"\n\n**Processamento:**\n1. Calcular datas (início e fim do mês atual)\n2. Consultar todas as despesas do período\n\n**Tool Call - Consultar despesas:**\n```typescript\ntool_consultar_despesas({\n  user_id: \"user_id_atual\",\n  valor: \"50.00\",\n  data: \"2024-03-31\",\n});\n```\n\n**Resposta:**\n```\n📊 Total de despesas em Março/2024:\n💰 R$ 2.345,67\n```\n\n## CATEGORIAS\n\n### Despesas\n- **Alimentação**: comida, restaurante, mercado, lanche, almoço, jantar, café\n- **Transporte**: gasolina, combustível, uber, táxi, ônibus, metrô, estacionamento\n- **Moradia**: aluguel, condomínio, luz, água, gás, internet, iptu\n- **Saúde**: médico, consulta, remédio, farmácia, exame, dentista\n- **Educação**: escola, faculdade, curso, livro, material\n- **Lazer**: cinema, show, viagem, festa, jogos, streaming, spotify, netflix\n- **Roupas**: roupa, calçado, tênis, camisa, calça, vestido\n- **Tecnologia**: celular, computador, software, app, hardware\n- **Serviços**: assinatura, manutenção, limpeza, conserto\n- **Outros**: demais gastos\n\n### Receitas\n- **Salário**: pagamento, salário, contracheque, folha\n- **Freelance**: freela, freelance, projeto, consultoria\n- **Investimentos**: dividendos, juros, rendimento, aplicação\n- **Vendas**: venda, produto, comissão\n- **Aluguel Recebido**: aluguel recebido, locação, arrendamento\n- **Outros**: demais receitas\n\n## PROCESSAMENTO AUTOMÁTICO\n\n### Identificação do Tipo\n\n- **DESPESA**: gastei, paguei, comprei, débito, pagamento, conta, saque, retirada, boleto, fatura, mensalidade, recarga, pix enviado, aluguel, gasolina (quando é abastecimento), abasteci, abastecimento, supermercado, prestação, tarifa, juros, lanche, restaurante, uber, transporte, serviço, cartão\n\n- **RECEITA**: recebi, ganhei, depósito, crédito, salário, venda, entrada, recebimento, pix recebido, comissão, bônus, reembolso, rendimento, dividendo, aluguel recebido, premiação, pró-labore, adiantamento, cliente pagou, nota emitida, lucro\n\n- **COMPROMISSO**: marque, agende, marcar, agendar, compromisso, evento, reunião, consulta médica, dentista (sem valor), appointment, lembrete, lembre-me\n\n### Extração de Valor\n\n- Remove símbolos monetários (R$, $)\n- Converte vírgulas para pontos\n- Converte números por extenso\n- Arredonda para 2 casas decimais\n\n### 🗓️ PROCESSAMENTO DE DATA - INTERPRETAÇÃO INTELIGENTE\n\n**SEMPRE calcule datas relativas automaticamente com base na data/hora atual:**\n\n#### Referências Absolutas:\n- \"hoje\" → `{{$now}}` (data atual)\n- \"ontem\" → `{{$now}}` - 1 dia\n- \"anteontem\" → `{{$now}}` - 2 dias\n\n#### Referências Futuras Próximas:\n- \"amanhã\" → `{{$now}}` + 1 dia\n- \"depois de amanhã\" → `{{$now}}` + 2 dias\n\n#### Dias da Semana (sempre futuro próximo):\n**Regra**: Use `{{ $now.weekdayLong }}` para identificar o dia atual. Se o dia mencionado já passou esta semana, considere a próxima semana.\n\n**Lógica de cálculo**:\n- Identifique o dia atual via `{{ $now.weekdayLong }}`\n- Se o usuário mencionar um dia da semana SEM \"próxima/próximo\": calcule o próximo dia daquela semana\n- Se incluir \"próxima/próximo\": sempre pule para a semana seguinte\n\n**Exemplos (use apenas como referência lógica, calcule sempre dinamicamente)**:\n- \"segunda\" → próxima segunda a partir de hoje\n- \"terça\" → próxima terça a partir de hoje\n- \"próxima terça\" → terça da semana seguinte (não desta semana)\n\n#### Referências de Semana:\n- \"semana que vem\" ou \"próxima semana\" → segunda-feira calculada a partir de `{{$now}}`\n- \"final de semana\" → próximo sábado calculado\n- \"fim de semana que vem\" → sábado da próxima semana\n\n#### Referências de Mês:\n- \"mês que vem\" ou \"próximo mês\" → dia 1 do mês seguinte a `{{$now}}`\n- \"final do mês\" → último dia do mês de `{{$now}}`\n\n#### Datas Numéricas:\n- \"dia 15\" → dia 15 do mês atual de `{{$now}}` (se já passou, considere mês seguinte)\n- \"15/12\" → 15 de dezembro do ano atual\n- \"15 de dezembro\" → 15/12 do ano atual\n\n#### Formato final: YYYY-MM-DD\n\n### Classificação de Categoria\n\n- Compara palavras-chave da descrição\n- Seleciona categoria com mais correspondências\n- Se não encontrar: usa \"Outros\"\n\n## ⚠️ IMPORTANTE: MAPEAMENTO DE CATEGORIAS\n\n**SEMPRE use UUIDs, nunca nomes de categoria!**\n\n### Processo Correto:\n1. **Identifique o tipo** (receita/despesa)\n2. **Consulte as categorias** do usuário com `tool_consultar_categorias`\n3. **Encontre o UUID** da categoria mais adequada\n4. **Use o UUID** no `categoria_id` ao salvar\n\n## ⚠️ IMPORTANTE: USE SEMPRE AS VARIÁVEIS DE DATA ATUAL\n\n**NUNCA use datas fixas nos exemplos ou processamento!**\n\nSempre calcule com base em:\n- `{{$now.format('dd/MM/yyyy')}}` - Data atual\n- `{{ $now.weekdayLong }}` - Dia da semana atual\n- `{{ $now.hour }}` e `{{ $now.minute }}` - Hora atual\n\nOs exemplos abaixo são meramente ilustrativos. **Na prática, calcule tudo dinamicamente.**\n\n## EXEMPLOS DE PROCESSAMENTO COM DATAS\n\n### Exemplo 1: Data Relativa Simples\n\n**Entrada:** \"Marque dentista amanhã\"\n\n**Processamento:**\n- Tipo: compromisso\n- Data: calcule {{$now}} + 1 dia\n- **NÃO PERGUNTE a data**\n- **CHAME A TOOL IMEDIATAMENTE**\n\n**Tool Call:**\n```typescript\ntool_agendar_compromisso({\n  user_id: \"user_id_atual\",\n  titulo: \"Dentista\",\n  descricao: \"Consulta no dentista\",\n  data: \"YYYY-MM-DD\", // Data calculada dinamicamente (hoje + 1)\n});\n```\n\n**Resposta:**\n```\n✅ Compromisso agendado:\n📋 Dentista\n📅 [data calculada no formato dd/MM/yyyy]\n```\n\n### Exemplo 2: Dia da Semana Futuro\n\n**Entrada:** \"Agende reunião na próxima terça\"\n\n**Processamento:**\n- Tipo: compromisso\n- Identifique o dia da semana atual via `{{ $now.weekdayLong }}`\n- Calcule a próxima terça (semana seguinte)\n- **NÃO PERGUNTE a data**\n- **CHAME A TOOL IMEDIATAMENTE**\n\n**Tool Call:**\n```typescript\ntool_agendar_compromisso({\n  user_id: \"user_id_atual\",\n  titulo: \"Reunião\",\n  descricao: \"Reunião agendada\",\n  data: \"YYYY-MM-DD\", // Próxima terça calculada dinamicamente\n});\n```\n\n**Resposta:**\n```\n✅ Compromisso agendado:\n📋 Reunião\n📅 [próxima terça-feira calculada]\n```\n\n### Exemplo 3: Consultar Compromissos (Padrão - 7 dias)\n\n**Entrada:** \"Quais meus próximos compromissos?\"\n\n**Processamento:**\n- Tipo: consulta de compromissos\n- Período: NÃO especificado → usar padrão de 7 dias\n- Calcular datas: {{$now}} até {{$now}} + 6 dias\n- **CHAME A TOOL para cada dia**\n\n**Tool Calls (7 chamadas):**\n```typescript\n// Dia 1\ntool_consultar_compromisso({\n  user_id: \"user_id_atual\",\n  data: \"YYYY-MM-DD\", // Hoje\n});\n\n// Dia 2\ntool_consultar_compromisso({\n  user_id: \"user_id_atual\",\n  data: \"YYYY-MM-DD\", // Amanhã\n});\n\n// ... continua até dia 7\n```\n\n**Resposta:**\n```\n📅 Compromissos - Próximos 7 dias:\n\n**Sexta-feira, 13/12:**\n• Dentista - 14:00\n\n**Segunda-feira, 16/12:**\n• Reunião com cliente - 10:00\n• Apresentação projeto - 15:30\n\n**Quarta-feira, 18/12:**\n• Consulta médica - 09:00\n\nNenhum compromisso nos outros dias.\n```\n\n### Exemplo 3b: Consultar Compromissos (Data Específica)\n\n**Entrada:** \"O que tenho amanhã?\"\n\n**Processamento:**\n- Tipo: consulta de compromissos\n- Período: específico (amanhã)\n- Data: {{$now}} + 1 dia\n- **CHAME A TOOL apenas para amanhã**\n\n**Tool Call:**\n```typescript\ntool_consultar_compromisso({\n  user_id: \"user_id_atual\",\n  data: \"YYYY-MM-DD\", // Amanhã\n});\n```\n\n**Resposta:**\n```\n📅 Compromissos em Sexta-feira, 13/12:\n• Dentista - 14:00\n• Jantar com amigos - 20:00\n```\n\n### Exemplo 4: Ambiguidade Real\n\n**Entrada:** \"Gasolina 50 reais\"\n\n**Processamento:**\n- Tipo: AMBÍGUO (pode ser despesa de abastecimento OU receita de venda)\n- **PERGUNTE para esclarecer**\n\n**Resposta:**\n\"É despesa (você abasteceu) ou receita (você vendeu)?\"\n\n### Exemplo 5: Despesa com Contexto de Saúde\n\n**Entrada:** \"Paguei 200 reais na consulta do dentista hoje\"\n\n**Processamento:**\n- Tipo: DESPESA (verbo \"paguei\" + valor)\n- Categoria: Saúde\n- Data: hoje\n- **NÃO é compromisso** (tem valor monetário)\n- **CONSULTE CATEGORIAS primeiro**\n- **CHAME tool_salvar_despesas**\n\n**Tool Calls:**\n```typescript\n// 1. Consultar categorias\ntool_consultar_categorias({\n  user_id: \"user_id_atual\",\n  tipo: \"despesa\",\n});\n\n// 2. Salvar despesa\ntool_salvar_despesas({\n  user_id: \"user_id_atual\",\n  categoria_id: \"uuid-da-categoria-saude\",\n  descricao: \"Consulta dentista\",\n  valor: 200.00,\n  data: \"YYYY-MM-DD\", // Data de hoje\n});\n```\n\n**Resposta:**\n```\n✅ Despesa registrada:\n📝 Consulta dentista\n💰 R$ 200,00\n🏷️ Saúde\n```"
        }
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [
        3552,
        -2032
      ],
      "id": "70ac6662-aa7d-4b42-b6ce-6bc977c877a3",
      "name": "Assistente Virtual",
      "retryOnFail": true,
      "waitBetweenTries": 5000,
      "maxTries": 5
    },
    {
      "parameters": {
        "jsCode": "// Use esta versão\nconst whatsappId = $('Webhook').first().json.body.data.key.remoteJid;\nconst telefone = whatsappId.split('@')[0].replace('55', '');\n\nreturn [{\n  telefone: telefone\n}];"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        2704,
        -2848
      ],
      "id": "9e8e8f5c-7fb6-4b1a-83ff-89117ff8c914",
      "name": "extrair remotejid"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "d7e5d217-d096-430b-97b3-53a7474dc9b2",
              "leftValue": "={{ $json.id }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "exists",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        2000,
        -2816
      ],
      "id": "19151b6e-247c-41b6-bc1e-883a2a7d472f",
      "name": "Cadastro existe?"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 2
          },
          "conditions": [
            {
              "id": "93aca1ae-9415-4f08-9eef-9a29fb2e68af",
              "leftValue": "={{ $json.status }}",
              "rightValue": "",
              "operator": {
                "type": "boolean",
                "operation": "false",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [
        2304,
        -2832
      ],
      "id": "84b59c11-ef76-4ef8-a874-115c757ab3e4",
      "name": "Cadastro está ativo?"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Definições Globais').item.json.url_base }}/message/sendText/{{ $('Definições Globais').item.json.instancia }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "ApiKey",
              "value": "={{ $('Definições Globais').item.json.apikey }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "number",
              "value": "={{ $item(\"0\").$node[\"Webhook\"].json[\"body\"][\"data\"][\"key\"][\"remoteJid\"] }}"
            },
            {
              "name": "text",
              "value": "=Oi! Aqui é da AcertAI 🤖💚\nLocalizei seu cadastro no nosso sistema de controle financeiro, mas ele ainda está *Inativo*.\nPara liberar sua conta e começar a acompanhar entradas, saídas e relatórios, acesse:\n👉 https://acertai.com/#planos\n\nDepois de ativar, você já consegue usar todas as funções normalmente.\nQualquer dúvida, só me chamar! 😉"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2304,
        -2352
      ],
      "id": "80c34859-6306-4527-b145-e95fd8c23372",
      "name": "Cliente possui cadastro mas está inativo"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Definições Globais').item.json.url_base }}/message/sendText/{{ $('Definições Globais').item.json.instancia }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "ApiKey",
              "value": "={{ $('Definições Globais').item.json.apikey }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "number",
              "value": "={{ $item(\"0\").$node[\"Webhook\"].json[\"body\"][\"data\"][\"key\"][\"remoteJid\"] }}"
            },
            {
              "name": "text",
              "value": "=Olá! Aqui é a AcertAI 🤖💚\nVocê tentou contato, mas ainda não possui um cadastro no nosso sistema de controle financeiro.\nCrie sua conta para organizar seus ganhos, despesas e relatórios em um só lugar:\n👉 https://acertai-sandy.vercel.app/\n\nO cadastro é rápido.\nSe precisar, estou aqui pra ajudar! 🚀"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1952,
        -2352
      ],
      "id": "520bd407-05dc-41e2-b9eb-a788084859e0",
      "name": "Cliente não possui cadastro ainda "
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "profiles",
          "mode": "list",
          "cachedResultName": "profiles"
        },
        "limit": 1,
        "where": {
          "values": [
            {
              "column": "telefone",
              "value": "={{ $json.cadastro }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [
        1600,
        -2816
      ],
      "id": "79149525-62ba-45f9-81e6-99194c645652",
      "name": "consultar_user_id",
      "alwaysOutputData": true,
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "categorias",
          "mode": "list",
          "cachedResultName": "categorias"
        },
        "returnAll": true,
        "where": {
          "values": [
            {
              "column": "user_id",
              "value": "={{ $('consultar_user_id').item.json.user_id }}"
            },
            {
              "column": "tipo",
              "value": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('values1_Value', `despesa`, 'string') }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        4112,
        -1616
      ],
      "id": "573f4b6a-9052-4d7c-9a87-e3c0b1de2b99",
      "name": "tool_consultar_categorias1",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "despesas",
          "mode": "list",
          "cachedResultName": "despesas"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "user_id": "={{ $('consultar_user_id').item.json.user_id }}",
            "valor": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('valor', `0`, 'number') }}",
            "categoria_id": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('categoria_id', ``, 'string') }}",
            "descricao": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('descricao', ``, 'string') }}",
            "data": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('data', `$now.format('yyyy-MM-dd')`, 'string') }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "user_id",
              "displayName": "user_id",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "categoria_id",
              "displayName": "categoria_id",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "descricao",
              "displayName": "descricao",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "valor",
              "displayName": "valor",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "data",
              "displayName": "data",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "updated_at",
              "displayName": "updated_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        3712,
        -1616
      ],
      "id": "6f16934d-3d15-41e0-98b2-496bd352df06",
      "name": "tool_salvar_despesas1",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "receitas",
          "mode": "list",
          "cachedResultName": "receitas"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "user_id": "={{ $('consultar_user_id').item.json.user_id }}",
            "valor": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('valor', `0`, 'number') }}",
            "categoria_id": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('categoria_id', `ID da categoria`, 'string') }}",
            "descricao": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('descricao', `descrição`, 'string') }}",
            "data": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('data', `$now.format('yyyy-MM-dd')`, 'string') }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "user_id",
              "displayName": "user_id",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "categoria_id",
              "displayName": "categoria_id",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "descricao",
              "displayName": "descricao",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "valor",
              "displayName": "valor",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "number",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "data",
              "displayName": "data",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "updated_at",
              "displayName": "updated_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        3712,
        -1424
      ],
      "id": "c278932d-8e2e-408f-9bab-93def631f365",
      "name": "tool_salvar_receitas1",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "despesas",
          "mode": "list",
          "cachedResultName": "despesas"
        },
        "returnAll": true,
        "where": {
          "values": [
            {
              "column": "user_id",
              "value": "={{ $('consultar_user_id').item.json.user_id }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        3504,
        -1616
      ],
      "id": "0f4c7237-3740-45fa-bc3a-55cbd9379a36",
      "name": "tool_consultar_despesas1",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "receitas",
          "mode": "list",
          "cachedResultName": "receitas"
        },
        "returnAll": true,
        "where": {
          "values": [
            {
              "column": "user_id",
              "value": "={{ $('consultar_user_id').item.json.user_id }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        3504,
        -1424
      ],
      "id": "65a0ca3f-8263-4673-b40b-169f347fed49",
      "name": "tool_consultar_receitas1",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {
        "content": "",
        "height": 300,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        1536,
        -2928
      ],
      "id": "c16bc58b-d4fe-48eb-9bd9-c494aa726e51",
      "name": "Sticky Note"
    },
    {
      "parameters": {
        "content": "## Consulta Cadastro\n",
        "height": 80,
        "width": 216,
        "color": 5
      },
      "id": "122ddf07-9b78-4385-8eef-2d3b410663e3",
      "name": "Sticky Note55",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        1520,
        -2960
      ]
    },
    {
      "parameters": {
        "content": "",
        "height": 300,
        "width": 620,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        1904,
        -2928
      ],
      "id": "d8c2dd4d-2a56-42f6-91f5-9648bb3cf088",
      "name": "Sticky Note12"
    },
    {
      "parameters": {
        "content": "## Faz verificação de cadastro e se está ativo",
        "height": 80,
        "width": 336,
        "color": 5
      },
      "id": "01df0086-7a82-46c1-9c0a-f14801fa32fb",
      "name": "Sticky Note58",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        1888,
        -2960
      ]
    },
    {
      "parameters": {
        "content": "",
        "height": 300,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        1888,
        -2464
      ],
      "id": "ccfee0ed-45f9-4ff0-99b8-6c0bdfca9b74",
      "name": "Sticky Note4"
    },
    {
      "parameters": {
        "content": "## Não possui cadastro\n",
        "height": 80,
        "width": 216,
        "color": 5
      },
      "id": "185da8e7-acba-48d9-9788-ac21a2d3bd51",
      "name": "Sticky Note59",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        1872,
        -2496
      ]
    },
    {
      "parameters": {
        "content": "",
        "height": 300,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        2224,
        -2464
      ],
      "id": "82cd9e48-3158-4d67-a781-7e0ed9a25962",
      "name": "Sticky Note7"
    },
    {
      "parameters": {
        "content": "## Possui cadastro porém INATIVO\n",
        "height": 80,
        "width": 216,
        "color": 5
      },
      "id": "f23a6ac9-16d9-40fc-93f2-a2d6f9ee4e04",
      "name": "Sticky Note60",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        2208,
        -2496
      ]
    },
    {
      "parameters": {
        "content": "",
        "height": 300,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        2624,
        -2928
      ],
      "id": "609b3824-81dd-475d-956a-20acd854994b",
      "name": "Sticky Note10"
    },
    {
      "parameters": {
        "content": "## Trata Telefone\n",
        "height": 80,
        "width": 216,
        "color": 5
      },
      "id": "c6f6488d-c07b-40ed-bcff-0e1cf5441814",
      "name": "Sticky Note61",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        2608,
        -2960
      ]
    },
    {
      "parameters": {
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "compromissos",
          "mode": "list",
          "cachedResultName": "compromissos"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "user_id": "={{ $('consultar_user_id').item.json.user_id }}",
            "data": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('data', `data do compromisso no formato: $now.format('yyyy-MM-dd')`, 'string') }}",
            "titulo": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('titulo', `Titulo do compromisso`, 'string') }}",
            "hora": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('hora', `hora do compromisso`, 'string') }}",
            "descricao": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('descricao', `descrição do compromisso`, 'string') }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "user_id",
              "displayName": "user_id",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "titulo",
              "displayName": "titulo",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "descricao",
              "displayName": "descricao",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "data",
              "displayName": "data",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "hora",
              "displayName": "hora",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "time",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "lembrete_enviado",
              "displayName": "lembrete_enviado",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "boolean",
              "canBeUsedToMatch": true,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        3904,
        -1616
      ],
      "id": "6f461616-d1dc-4ba5-bf19-b5522584bc7a",
      "name": "tool_agendar_compromisso",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {
        "operation": "upsert",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "compromissos",
          "mode": "list",
          "cachedResultName": "compromissos"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "id": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('id__using_to_match_', `ID da coluna a ser ajustada/editada`, 'string') }}",
            "user_id": "={{ $('consultar_user_id').item.json.user_id }}",
            "titulo": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('titulo', ``, 'string') }}",
            "descrição": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('descri__o', ``, 'string') }}",
            "data": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('data', `data do compromisso no formato: $now.format('2025-12-02 03:00:00+00')`, 'string') }}",
            "hora": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('hora', `hora do compromisso`, 'string') }}",
            "lembrete_enviado": false
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": false
            },
            {
              "id": "user_id",
              "displayName": "user_id",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": false
            },
            {
              "id": "titulo",
              "displayName": "titulo",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": false
            },
            {
              "id": "descrição",
              "displayName": "descrição",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": false
            },
            {
              "id": "data",
              "displayName": "data",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": false
            },
            {
              "id": "hora",
              "displayName": "hora",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "time",
              "canBeUsedToMatch": false,
              "removed": false
            },
            {
              "id": "lembrete_enviado",
              "displayName": "lembrete_enviado",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "boolean",
              "canBeUsedToMatch": false,
              "removed": false
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        4128,
        -1424
      ],
      "id": "d43cc092-03d4-4de1-a6d1-9410b82281b4",
      "name": "tool_editar_compromisso",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {},
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [
        5248,
        -2176
      ],
      "id": "810b8bb0-1a2f-41c6-8eb2-d251c20acf3f",
      "name": "No Operation, do nothing"
    },
    {
      "parameters": {},
      "type": "@n8n/n8n-nodes-langchain.toolCalculator",
      "typeVersion": 1,
      "position": [
        3312,
        -1616
      ],
      "id": "7d16b42c-0327-47aa-bbf9-383285402c6e",
      "name": "tool_calculadora"
    },
    {
      "parameters": {},
      "type": "@n8n/n8n-nodes-langchain.toolThink",
      "typeVersion": 1.1,
      "position": [
        3296,
        -1408
      ],
      "id": "69203bce-f145-4eec-8b03-d4754c307045",
      "name": "Think"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Definições Globais').item.json.url_base }}/chat/getBase64FromMediaMessage/{{ $('Definições Globais').item.json.instancia }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "={{ $('Definições Globais').item.json.apikey }}"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n    \"message\": {\n        \"key\": {\n            \"id\":  \"{{ $('Definições Globais').item.json.base64 }}\"\n        }\n    },\n    \"convertToMp4\": true\n} ",
        "options": {}
      },
      "id": "74ec3af4-9887-47c0-95c8-3aebf8cbc3dd",
      "name": "Mensagem de Audio1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [
        3520,
        -3440
      ],
      "retryOnFail": true,
      "maxTries": 2,
      "alwaysOutputData": false,
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "operation": "toBinary",
        "sourceProperty": "base64",
        "options": {}
      },
      "id": "504c0cce-7470-4c58-aeb2-b8d6e3866863",
      "name": "Converter Áudio1",
      "type": "n8n-nodes-base.convertToFile",
      "typeVersion": 1.1,
      "position": [
        3680,
        -3440
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Definições Globais').item.json.url_base }}/chat/getBase64FromMediaMessage/{{ $('Definições Globais').item.json.instancia }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "={{ $('Definições Globais').item.json.apikey }}"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n    \"message\": {\n        \"key\": {\n            \"id\":  \"{{ $('Definições Globais').item.json.base64 }}\"\n        }\n    },\n    \"convertToMp4\": true\n} ",
        "options": {}
      },
      "id": "b55a4e5d-27e3-4e6a-9924-780220c8fe67",
      "name": "Envio de Imagens1",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [
        3536,
        -3024
      ],
      "retryOnFail": true,
      "maxTries": 2,
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "operation": "toBinary",
        "sourceProperty": "base64",
        "options": {
          "fileName": "image",
          "mimeType": ""
        }
      },
      "id": "37191649-954f-4add-b7fe-f471aae2982d",
      "name": "Converter Imagem1",
      "type": "n8n-nodes-base.convertToFile",
      "typeVersion": 1.1,
      "position": [
        3712,
        -3024
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $('Definições Globais').item.json.url_base }}/chat/getBase64FromMediaMessage/{{ $('Definições Globais').item.json.instancia }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "={{ $('Definições Globais').item.json.apikey }}"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n    \"message\": {\n        \"key\": {\n            \"id\":  \"{{ $('Definições Globais').item.json.base64 }}\"\n        }\n    },\n    \"convertToMp4\": true\n} ",
        "options": {}
      },
      "id": "883bd804-cbe5-4113-a924-a65559c3d3d0",
      "name": "Envio de Imagens",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [
        3536,
        -2656
      ],
      "retryOnFail": true,
      "maxTries": 2,
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "operation": "toBinary",
        "sourceProperty": "base64",
        "options": {}
      },
      "type": "n8n-nodes-base.convertToFile",
      "typeVersion": 1.1,
      "position": [
        3728,
        -2656
      ],
      "id": "510e4afc-6495-4a9b-8c55-2554b1332b96",
      "name": "Convert to File"
    },
    {
      "parameters": {
        "operation": "pdf",
        "binaryPropertyName": "=data",
        "options": {}
      },
      "type": "n8n-nodes-base.extractFromFile",
      "typeVersion": 1.1,
      "position": [
        3904,
        -2656
      ],
      "id": "f4a134f2-7e01-4c58-b397-c3a05e4da54a",
      "name": "Extract from File"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "a7322056-3060-4893-9d0d-13f49560c27c",
              "name": "remoteJid",
              "value": "={{ $('Definições Globais').item.json.remoteJid }}",
              "type": "string"
            },
            {
              "id": "424c7671-5250-4bf2-aa56-d12759837522",
              "name": "mensagem",
              "value": "={{ $json.text }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "921cbe15-42f2-423e-9cad-5b86d007adaa",
      "name": "texto extraido",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        4064,
        -2656
      ]
    },
    {
      "parameters": {
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "categorias",
          "mode": "list",
          "cachedResultName": "categorias"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "user_id": "={{ $('consultar_user_id').item.json.user_id }}",
            "nome": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('nome', ``, 'string') }}",
            "tipo": "despesa",
            "cor": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('cor', ``, 'string') }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "user_id",
              "displayName": "user_id",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "nome",
              "displayName": "nome",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "tipo",
              "displayName": "tipo",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "options",
              "canBeUsedToMatch": true,
              "options": [
                {
                  "name": "receita",
                  "value": "receita"
                },
                {
                  "name": "despesa",
                  "value": "despesa"
                }
              ]
            },
            {
              "id": "cor",
              "displayName": "cor",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "icone",
              "displayName": "icone",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "updated_at",
              "displayName": "updated_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        4320,
        -1616
      ],
      "id": "0c6afa33-909c-43d4-a330-e264fbedb294",
      "name": "tool_criar_categoria_despesa",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {
        "schema": {
          "__rl": true,
          "mode": "list",
          "value": "public"
        },
        "table": {
          "__rl": true,
          "value": "categorias",
          "mode": "list",
          "cachedResultName": "categorias"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "user_id": "={{ $('consultar_user_id').item.json.user_id }}",
            "nome": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('nome', ``, 'string') }}",
            "tipo": "receita",
            "cor": "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('cor', ``, 'string') }}"
          },
          "matchingColumns": [
            "id"
          ],
          "schema": [
            {
              "id": "id",
              "displayName": "id",
              "required": false,
              "defaultMatch": true,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "user_id",
              "displayName": "user_id",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "nome",
              "displayName": "nome",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "tipo",
              "displayName": "tipo",
              "required": true,
              "defaultMatch": false,
              "display": true,
              "type": "options",
              "canBeUsedToMatch": true,
              "options": [
                {
                  "name": "receita",
                  "value": "receita"
                },
                {
                  "name": "despesa",
                  "value": "despesa"
                }
              ]
            },
            {
              "id": "cor",
              "displayName": "cor",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true
            },
            {
              "id": "icone",
              "displayName": "icone",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "string",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "created_at",
              "displayName": "created_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            },
            {
              "id": "updated_at",
              "displayName": "updated_at",
              "required": false,
              "defaultMatch": false,
              "display": true,
              "type": "dateTime",
              "canBeUsedToMatch": true,
              "removed": true
            }
          ],
          "attemptToConvertTypes": false,
          "convertFieldsToString": false
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        4336,
        -1424
      ],
      "id": "9950e95d-f5e7-424e-94ba-7dd662c0e61a",
      "name": "tool_criar_categoria_receita",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "32ef3512-b6f5-40fe-bd83-cca06bd6f8cd",
              "name": "base64",
              "value": "={{ $('Definições Globais').item.json.base64 }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3520,
        -3264
      ],
      "id": "5563e467-5e3e-4faf-8ca2-1c7f645ff99c",
      "name": "Edit Fields3"
    },
    {
      "parameters": {
        "resource": "audio",
        "operation": "transcribe",
        "binaryPropertyName": "=data",
        "options": {}
      },
      "id": "6ed8ecf9-d0c9-4492-beab-412ca8af69e2",
      "name": "Transcreve Áudio2",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.4,
      "position": [
        3856,
        -3264
      ],
      "credentials": {
        "openAiApi": {
          "id": "miqkTTbtvpvRoFjN",
          "name": "Hub - IA"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "a7322056-3060-4893-9d0d-13f49560c27c",
              "name": "remoteJid",
              "value": "={{ $('Definições Globais').item.json.remoteJid }}",
              "type": "string"
            },
            {
              "id": "424c7671-5250-4bf2-aa56-d12759837522",
              "name": "mensagem",
              "value": "={{ $item(\"0\").$node[\"Transcreve Áudio2\"].json[\"text\"] }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "4456496a-165f-46d8-8943-d32fbaf59fe6",
      "name": "Transcrição2",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        4032,
        -3264
      ]
    },
    {
      "parameters": {
        "operation": "toBinary",
        "sourceProperty": "base64",
        "options": {
          "fileName": "mp3"
        }
      },
      "id": "c2b745b1-1f1e-424a-9505-42b4e1a0e420",
      "name": "Converter Áudio",
      "type": "n8n-nodes-base.convertToFile",
      "typeVersion": 1.1,
      "position": [
        3696,
        -3264
      ]
    },
    {
      "parameters": {},
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [
        4016,
        -3632
      ],
      "id": "75982c22-7dd7-4492-91a1-0cdd814adc80",
      "name": "No Operation, do nothing1"
    },
    {
      "parameters": {
        "operation": "toBinary",
        "sourceProperty": "base64",
        "options": {
          "fileName": "image",
          "mimeType": "image/jpeg"
        }
      },
      "id": "a4a0d54d-49c3-46f0-bf51-3f391c252150",
      "name": "Convert to JPG",
      "type": "n8n-nodes-base.convertToFile",
      "typeVersion": 1.1,
      "position": [
        3696,
        -2832
      ]
    },
    {
      "parameters": {
        "resource": "image",
        "operation": "analyze",
        "modelId": {
          "__rl": true,
          "value": "gpt-4o-mini",
          "mode": "list",
          "cachedResultName": "GPT-4O-MINI"
        },
        "text": "=Você é um analista financeiro, com larga experiência em consultoria de finanças familiares.\n\nAnalise este comprovante financeiro e extraia as seguintes informações em formato JSON:\n\n{\n  \"tipo\": \"receita\" ou \"despesa\",\n  \"descricao\": \"descrição clara da transação\",\n  \"valor\": número (apenas o valor numérico, sem símbolos),\n  \"categoria\": \"categoria apropriada (Veja abaixo as categorias disponíveis)\",\n  \"data\": \"data no formato YYYY-MM-DD\"\n}\n\n### Despesas\n\n- **Alimentação**: comida, restaurante, mercado, lanche, almoço, jantar, café\n- **Transporte**: gasolina, combustível, uber, táxi, ônibus, metrô, estacionamento\n- **Moradia**: aluguel, condomínio, luz, água, gás, internet, iptu\n- **Saúde**: médico, consulta, remédio, farmácia, exame, dentista\n- **Educação**: escola, faculdade, curso, livro, material\n- **Lazer**: cinema, show, viagem, festa, jogos, streaming, spotify, netflix\n- **Roupas**: roupa, calçado, tênis, camisa, calça, vestido\n- **Tecnologia**: celular, computador, software, app, hardware\n- **Serviços**: assinatura, manutenção, limpeza, conserto\n- **Outros**: demais gastos\n\n### Receitas\n\n- **Salário**: pagamento, salário, contracheque, folha\n- **Freelance**: freela, freelance, projeto, consultoria\n- **Investimentos**: dividendos, juros, rendimento, aplicação\n- **Vendas**: venda, produto, comissão\n- **Aluguel Recebido**: aluguel recebido, locação, arrendamento\n- **Outros**: demais receitas\n\nRegras importantes:\n- Se for uma nota fiscal de compra/pagamento = \"despesa\"\n- Se for um comprovante de pagamento recebido/depósito = \"receita\"\n- Para o valor, extraia apenas números (ex: se vê \"R$ 150,50\", retorne 150.5)\n- Para categoria, use termos como: Alimentação, Transporte, Saúde, Educação, Lazer, Moradia, Salário, Freelance, Vendas e etc...\n- Para data, tente extrair a data da transação, não a data de emissão\n- Seja preciso na classificação entre receita e despesa\n\nResponda APENAS com o JSON, sem explicações adicionais.",
        "inputType": "=data",
        "simplify": false,
        "options": {}
      },
      "id": "a67dd068-872f-407e-9bb7-626c6478b8fa",
      "name": "Analisa Imagem2",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.4,
      "position": [
        3872,
        -2832
      ],
      "credentials": {
        "openAiApi": {
          "id": "miqkTTbtvpvRoFjN",
          "name": "Hub - IA"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "ff392999-d538-4fdf-83d6-932872f9f938",
              "name": "base64",
              "value": "={{ $('Definições Globais').item.json.base64 }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "dfe4e6b0-5478-40ee-98b2-f2a323d18a82",
      "name": "Imagem",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        3536,
        -2832
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "a7322056-3060-4893-9d0d-13f49560c27c",
              "name": "remoteJid",
              "value": "={{ $('Definições Globais').item.json.remoteJid }}",
              "type": "string"
            },
            {
              "id": "424c7671-5250-4bf2-aa56-d12759837522",
              "name": "mensagem",
              "value": "={{ $item(\"0\").$node[\"Analisa Imagem2\"].json[\"choices\"][\"0\"][\"message\"][\"content\"] }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "1b94aae6-477b-4868-9d63-3d232f9a8d9a",
      "name": "Imagem Analisada2",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        4032,
        -2832
      ]
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $('consultar_user_id').item.json.user_id }}",
        "contextWindowLength": 3
      },
      "type": "@n8n/n8n-nodes-langchain.memoryPostgresChat",
      "typeVersion": 1.3,
      "position": [
        2976,
        -1360
      ],
      "id": "3760c894-661e-42c2-9020-a02f0c99a512",
      "name": "Postgres Chat Memory",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $('consultar_user_id').item.json.user_id }}",
        "contextWindowLength": 10
      },
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.3,
      "position": [
        3136,
        -1408
      ],
      "id": "c650f987-4fe7-4f9f-b800-a158cb225e64",
      "name": "Simple Memory",
      "disabled": true
    },
    {
      "parameters": {
        "operation": "select",
        "schema": {
          "__rl": true,
          "value": "public",
          "mode": "list",
          "cachedResultName": "public"
        },
        "table": {
          "__rl": true,
          "value": "compromissos",
          "mode": "list",
          "cachedResultName": "compromissos"
        },
        "returnAll": true,
        "where": {
          "values": [
            {
              "column": "user_id",
              "value": "={{ $('consultar_user_id').item.json.user_id }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.postgresTool",
      "typeVersion": 2.6,
      "position": [
        3904,
        -1424
      ],
      "id": "c1750690-7841-449e-a74d-4682a0156d88",
      "name": "tool_consultar_compromisso",
      "credentials": {
        "postgres": {
          "id": "48iD2ikghUbXNBa9",
          "name": "IA-Tayroz"
        }
      }
    }
  ],
  "connections": {
    "Wait": {
      "main": [
        [
          {
            "node": "Loop Messages",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Loop Messages": {
      "main": [
        [
          {
            "node": "No Operation, do nothing",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Evolution API",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Split": {
      "main": [
        [
          {
            "node": "Loop Messages",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Webhook": {
      "main": [
        [
          {
            "node": "Definições Globais",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Analisa Imagem": {
      "main": [
        [
          {
            "node": "Imagem Analisada",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Switch messageType": {
      "main": [
        [
          {
            "node": "Texto",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Mensagem de Audio1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Envio de Imagens1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Envio de Imagens",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Texto": {
      "main": [
        [
          {
            "node": "No Operation, do nothing1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Transcreve Áudio": {
      "main": [
        [
          {
            "node": "Transcrição",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Transcrição": {
      "main": [
        [
          {
            "node": "Merge",
            "type": "main",
            "index": 1
          }
        ]
      ]
    },
    "Imagem Analisada": {
      "main": [
        [
          {
            "node": "Merge",
            "type": "main",
            "index": 3
          }
        ]
      ]
    },
    "Definições Globais": {
      "main": [
        [
          {
            "node": "consultar_user_id",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Listar Mensagens": {
      "main": [
        [
          {
            "node": "Debounce",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Puxar as Mensagens": {
      "main": [
        [
          {
            "node": "If",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "If": {
      "main": [
        [
          {
            "node": "Fragmenta",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Deleta Mesagem": {
      "main": [
        [
          {
            "node": "Assistente Virtual",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Debounce": {
      "main": [
        [
          {
            "node": "Puxar as Mensagens",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Fragmenta": {
      "main": [
        [
          {
            "node": "Deleta Mesagem",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Merge": {
      "main": [
        [
          {
            "node": "Listar Mensagens",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Evolution API": {
      "main": [
        [
          {
            "node": "Wait",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Assistente Virtual": {
      "main": [
        [
          {
            "node": "Split",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "extrair remotejid": {
      "main": [
        [
          {
            "node": "Switch messageType",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Cadastro existe?": {
      "main": [
        [
          {
            "node": "Cadastro está ativo?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Cliente não possui cadastro ainda ",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Cadastro está ativo?": {
      "main": [
        [
          {
            "node": "Cliente possui cadastro mas está inativo",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "extrair remotejid",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "consultar_user_id": {
      "main": [
        [
          {
            "node": "Cadastro existe?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "tool_consultar_categorias1": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "tool_salvar_despesas1": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "tool_salvar_receitas1": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "tool_consultar_despesas1": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "tool_consultar_receitas1": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "tool_agendar_compromisso": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "tool_editar_compromisso": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "tool_calculadora": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Think": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Mensagem de Audio1": {
      "main": [
        [
          {
            "node": "Converter Áudio1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Edit Fields3",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Converter Áudio1": {
      "main": [
        [
          {
            "node": "Transcreve Áudio",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Envio de Imagens1": {
      "main": [
        [
          {
            "node": "Converter Imagem1",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Imagem",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Converter Imagem1": {
      "main": [
        [
          {
            "node": "Analisa Imagem",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Envio de Imagens": {
      "main": [
        [
          {
            "node": "Convert to File",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Convert to File": {
      "main": [
        [
          {
            "node": "Extract from File",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract from File": {
      "main": [
        [
          {
            "node": "texto extraido",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "texto extraido": {
      "main": [
        [
          {
            "node": "Merge",
            "type": "main",
            "index": 5
          }
        ]
      ]
    },
    "tool_criar_categoria_despesa": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "tool_criar_categoria_receita": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Edit Fields3": {
      "main": [
        [
          {
            "node": "Converter Áudio",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Transcreve Áudio2": {
      "main": [
        [
          {
            "node": "Transcrição2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Transcrição2": {
      "main": [
        [
          {
            "node": "Merge",
            "type": "main",
            "index": 2
          }
        ]
      ]
    },
    "Converter Áudio": {
      "main": [
        [
          {
            "node": "Transcreve Áudio2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "No Operation, do nothing1": {
      "main": [
        [
          {
            "node": "Merge",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Convert to JPG": {
      "main": [
        [
          {
            "node": "Analisa Imagem2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Analisa Imagem2": {
      "main": [
        [
          {
            "node": "Imagem Analisada2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Imagem": {
      "main": [
        [
          {
            "node": "Convert to JPG",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Imagem Analisada2": {
      "main": [
        [
          {
            "node": "Merge",
            "type": "main",
            "index": 4
          }
        ]
      ]
    },
    "Postgres Chat Memory": {
      "ai_memory": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "tool_consultar_compromisso": {
      "ai_tool": [
        [
          {
            "node": "Assistente Virtual",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {
    "Webhook": [
      {
        "headers": {
          "host": "webhook.elieser.space",
          "user-agent": "axios/1.12.2",
          "content-length": "23929",
          "accept": "application/json, text/plain, */*",
          "accept-encoding": "gzip, compress, deflate, br",
          "content-type": "application/json",
          "x-forwarded-for": "172.18.0.1",
          "x-forwarded-host": "webhook.elieser.space",
          "x-forwarded-port": "443",
          "x-forwarded-proto": "https",
          "x-forwarded-server": "c1c43518954b",
          "x-real-ip": "172.18.0.1"
        },
        "params": {},
        "query": {},
        "body": {
          "event": "messages.upsert",
          "instance": "AcerAI",
          "data": {
            "key": {
              "remoteJid": "159696010891375@lid",
              "remoteJidAlt": "5521996148464@s.whatsapp.net",
              "fromMe": false,
              "id": "3A9ABE57B5095873953C",
              "participant": "",
              "addressingMode": "lid"
            },
            "pushName": "Juan  ",
            "status": "DELIVERY_ACK",
            "message": {
              "audioMessage": {
                "url": "https://mmg.whatsapp.net/v/t62.7117-24/551706163_874191701638085_2392735319313859701_n.enc?ccb=11-4&oh=01_Q5Aa3QHZfUfry1eNDr0nvquOMHJcsfWA0-Uv8cCE_wvTBDM3rA&oe=69651B5F&_nc_sid=5e03e0&mms3=true",
                "mimetype": "audio/ogg; codecs=opus",
                "fileSha256": {
                  "0": 106,
                  "1": 122,
                  "2": 219,
                  "3": 141,
                  "4": 103,
                  "5": 163,
                  "6": 48,
                  "7": 190,
                  "8": 148,
                  "9": 135,
                  "10": 225,
                  "11": 62,
                  "12": 140,
                  "13": 11,
                  "14": 61,
                  "15": 230,
                  "16": 220,
                  "17": 6,
                  "18": 254,
                  "19": 123,
                  "20": 155,
                  "21": 238,
                  "22": 122,
                  "23": 100,
                  "24": 46,
                  "25": 94,
                  "26": 180,
                  "27": 31,
                  "28": 22,
                  "29": 181,
                  "30": 90,
                  "31": 164
                },
                "fileLength": {
                  "low": 15392,
                  "high": 0,
                  "unsigned": true
                },
                "seconds": 6,
                "ptt": true,
                "mediaKey": {
                  "0": 249,
                  "1": 132,
                  "2": 136,
                  "3": 127,
                  "4": 222,
                  "5": 126,
                  "6": 142,
                  "7": 97,
                  "8": 16,
                  "9": 56,
                  "10": 245,
                  "11": 26,
                  "12": 233,
                  "13": 111,
                  "14": 228,
                  "15": 18,
                  "16": 206,
                  "17": 52,
                  "18": 152,
                  "19": 40,
                  "20": 153,
                  "21": 42,
                  "22": 22,
                  "23": 235,
                  "24": 102,
                  "25": 238,
                  "26": 40,
                  "27": 143,
                  "28": 105,
                  "29": 253,
                  "30": 47,
                  "31": 113
                },
                "fileEncSha256": {
                  "0": 70,
                  "1": 121,
                  "2": 24,
                  "3": 153,
                  "4": 199,
                  "5": 127,
                  "6": 140,
                  "7": 211,
                  "8": 14,
                  "9": 90,
                  "10": 120,
                  "11": 40,
                  "12": 183,
                  "13": 207,
                  "14": 48,
                  "15": 54,
                  "16": 49,
                  "17": 85,
                  "18": 95,
                  "19": 14,
                  "20": 3,
                  "21": 107,
                  "22": 23,
                  "23": 220,
                  "24": 205,
                  "25": 88,
                  "26": 110,
                  "27": 53,
                  "28": 13,
                  "29": 121,
                  "30": 167,
                  "31": 190
                },
                "directPath": "/v/t62.7117-24/551706163_874191701638085_2392735319313859701_n.enc?ccb=11-4&oh=01_Q5Aa3QHZfUfry1eNDr0nvquOMHJcsfWA0-Uv8cCE_wvTBDM3rA&oe=69651B5F&_nc_sid=5e03e0",
                "mediaKeyTimestamp": {
                  "low": 1765655717,
                  "high": 0,
                  "unsigned": false
                },
                "streamingSidecar": {
                  "0": 78,
                  "1": 133,
                  "2": 178,
                  "3": 249,
                  "4": 89,
                  "5": 246,
                  "6": 124,
                  "7": 165,
                  "8": 17,
                  "9": 192
                },
                "waveform": {
                  "0": 0,
                  "1": 4,
                  "2": 6,
                  "3": 7,
                  "4": 7,
                  "5": 6,
                  "6": 6,
                  "7": 7,
                  "8": 7,
                  "9": 7,
                  "10": 8,
                  "11": 9,
                  "12": 8,
                  "13": 7,
                  "14": 5,
                  "15": 23,
                  "16": 74,
                  "17": 77,
                  "18": 78,
                  "19": 85,
                  "20": 83,
                  "21": 77,
                  "22": 67,
                  "23": 52,
                  "24": 40,
                  "25": 33,
                  "26": 52,
                  "27": 53,
                  "28": 49,
                  "29": 66,
                  "30": 85,
                  "31": 96,
                  "32": 83,
                  "33": 63,
                  "34": 49,
                  "35": 50,
                  "36": 62,
                  "37": 66,
                  "38": 53,
                  "39": 36,
                  "40": 37,
                  "41": 61,
                  "42": 46,
                  "43": 44,
                  "44": 53,
                  "45": 40,
                  "46": 44,
                  "47": 56,
                  "48": 45,
                  "49": 35,
                  "50": 32,
                  "51": 59,
                  "52": 62,
                  "53": 56,
                  "54": 53,
                  "55": 41,
                  "56": 36,
                  "57": 50,
                  "58": 61,
                  "59": 62,
                  "60": 47,
                  "61": 37,
                  "62": 38,
                  "63": 54
                }
              },
              "messageContextInfo": {
                "deviceListMetadata": {
                  "senderKeyIndexes": [],
                  "recipientKeyIndexes": [],
                  "senderKeyHash": {
                    "0": 171,
                    "1": 233,
                    "2": 18,
                    "3": 148,
                    "4": 227,
                    "5": 234,
                    "6": 135,
                    "7": 251,
                    "8": 168,
                    "9": 71
                  },
                  "senderTimestamp": {
                    "low": 1761049342,
                    "high": 0,
                    "unsigned": true
                  },
                  "recipientKeyHash": {
                    "0": 92,
                    "1": 251,
                    "2": 245,
                    "3": 192,
                    "4": 131,
                    "5": 126,
                    "6": 172,
                    "7": 44,
                    "8": 93,
                    "9": 31
                  },
                  "recipientTimestamp": {
                    "low": 1765594358,
                    "high": 0,
                    "unsigned": true
                  }
                },
                "deviceListMetadataVersion": 2,
                "messageSecret": {
                  "0": 104,
                  "1": 237,
                  "2": 240,
                  "3": 38,
                  "4": 202,
                  "5": 50,
                  "6": 216,
                  "7": 132,
                  "8": 115,
                  "9": 12,
                  "10": 1,
                  "11": 101,
                  "12": 237,
                  "13": 64,
                  "14": 217,
                  "15": 160,
                  "16": 202,
                  "17": 120,
                  "18": 99,
                  "19": 151,
                  "20": 140,
                  "21": 61,
                  "22": 88,
                  "23": 242,
                  "24": 38,
                  "25": 208,
                  "26": 104,
                  "27": 67,
                  "28": 180,
                  "29": 171,
                  "30": 195,
                  "31": 46
                }
              },
              "base64": "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"
            },
            "contextInfo": null,
            "messageType": "audioMessage",
            "messageTimestamp": 1765655725,
            "instanceId": "804f043c-5239-4c34-b406-93154f0cf8a3",
            "source": "ios"
          },
          "destination": "https://webhook.elieser.space/webhook/acertai",
          "date_time": "2025-12-13T16:55:26.084Z",
          "sender": "5511952132034@s.whatsapp.net",
          "server_url": "https://api.elieser.space",
          "apikey": "AE4E77A2D66B-4B16-B41A-2CCD00AD5F9D"
        },
        "webhookUrl": "https://webhook.elieser.space/webhook/acertai",
        "executionMode": "production"
      }
    ]
  },
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "3eed9c8adbc05dd5867db25d2259f332486125a41fd7f622a0b570649fa971c5"
  }
}