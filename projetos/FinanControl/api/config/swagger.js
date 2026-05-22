
const documentacao = {
    openapi: '3.0.3',
    info:{
        title: 'API de FinanControl',
        description: 'Documentação da API de gerenciamento financeiro - FinanControl',
        version: '1.0.0'
    },
    servers: [
        {url: 'http://localhost:3001', description: 'localhost'},
        {url: 'https://api-eosin-rho.vercel.app', description: 'Vercel'}

    ],
    tags: [
        {name: 'Usuários', description: 'Operações relacionadas aos usuários'},
        {name: 'Categorias', description: 'Operações relacionadas as categorias'},
        {name: 'Subcategorias', description: 'Operações relacionadas as subcategorias'},
        {name: 'Transações', description: 'Operações relacionadas as transações'}
    ],
    paths: {
        "/usuarios": {
            get: {
                tags:["Usuários"],
                summary: "Listar todos os usuários",
                security:[
                    {bearerAuth: []}
                ],
                responses: {
                    200:{
                        description: "Dados obtidos com sucesso!",
                        content: {
                            "application/json":{
                                schema:{
                                    type: "array",
                                    items: {$ref: '#/components/schemas/Listar_Usuarios'}
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags:['Usuários'],
                summary: 'Cadastrar novo usuário',
                description: "Recebe nome, email, senha para cadastrar novo usuário",
                requestBody: {
                    required: true,
                    content: {
                        "application/json":{
                            schema: {
                                $ref: "#/components/schemas/Cadastrar_Usuario"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Usuário cadastrado com sucesso!"
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            }
        },
        "/usuarios/{id_usuario}":{
            put: {
                tags: ['Usuários'],
                summary: 'Atualizar todos os dados do usuário',
                description: 'Atualiza todos os dados de um usuário existente, é necessário enviar todos os campos',
                parameters: [
                    {
                        name: "id_usuario",
                        in: "path",
                        required: true,
                        description: "ID do usuário a ser atualizado",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content:{
                        "application/json":{
                            schema: {$ref: "#/components/schemas/Atualizar_Usuario"},
                            example: {
                                nome: "Ricardo Santos",
                                email:"ricardo5@sesisp.com",
                                senha: "senhaAtualizada",
                                tipo_acesso: "admin"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Usuário atualizado com sucesso!"
                    },
                    404: {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json":{
                                example: {message: "Usuário não encontrado"}
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                    
                }

            },
            delete: {
                tags: ['Usuários'],
                summary: 'Remover Usuário',
                security:[
                    {bearerAuth: []}
                ],
                description: 'Remove usuário existente pelo ID',
                parameters: [
                    {
                        name: "id_usuario",
                        in: "path",
                        required: true,
                        description: "ID do usuário a ser removido",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Usuário removido com sucesso!"
                    },
                    404: {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json":{
                                example: {message: "Usuário não encontrado"}
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                    
                }
            },
            
        },
        "/login": {
                post: {
                tags: ['Usuários'],
                summary: 'Realizar Login',
                description: "Autentica um usuario e retorna id e nome",
                requestBody: {
                    required: true,
                    content: {
                        "application/json":{
                            schema: {
                                $ref: "#/components/schemas/Login_Usuario"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Login realizado com sucesso!",
                        content: {
                        "application/json":{
                            schema: {
                                $ref: "#/components/schemas/Resposta_Login"
                            }
                        }
                    }
                    },
                    400: {description: "Email e senha são obrigatorios"},
                    401: {description: "Credenciais inválidas"},
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            }
        },
        "/categorias":{
            get: {
                tags:["Categorias"],
                summary: "Listar todos os categorias",
                responses: {
                    200:{
                        description: "Dados obtidos com sucesso!",
                        content: {
                            "application/json":{
                                schema:{
                                    type: "array",
                                    items: {$ref: '#/components/schemas/Listar_Categorias'}
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags:['Categorias'],
                summary: 'Cadastrar nova categoria',
                description: "Recebe nome, descricao, tipo, cor, icone, ativo para cadastrar nova categoria",
                requestBody: {
                    required: true,
                    content: {
                        "application/json":{
                            schema: {
                                $ref: "#/components/schemas/Cadastrar_Categorias"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Categoria cadastrado com sucesso!"
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            }
        },
        "/categorias/{id_categoria}":{
            put: {
                tags: ['Categorias'],
                summary: 'Atualizar todos os dados da categoria',
                description: 'Atualiza todos os dados de uma categoria existente, é necessário enviar todos os campos',
                parameters: [
                    {
                        name: "id_categoria",
                        in: "path",
                        required: true,
                        description: "ID da categoria a ser atualizado",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content:{
                        "application/json":{
                            schema: {$ref: "#/components/schemas/Atualizar_Categoria"},
                            example: {
                                nome: "Saúde",
                                descricao:"Equipamentos da saúde",
                                tipo: "E",
                                cor: "#874b4b",
                                icone: "icone"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Categoria atualizado com sucesso!"
                    },
                    404: {
                        description: "Categoria não encontrado",
                        content: {
                            "application/json":{
                                example: {message: "Categoria não encontrado"}
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                    
                }

            },
             delete: {
                tags: ['Categorias'],
                summary: 'Remover Categoria',
                description: 'Remove categoria existente pelo ID',
                parameters: [
                    {
                        name: "id_categoria",
                        in: "path",
                        required: true,
                        description: "ID do categoria a ser removido",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Categoria removido com sucesso!"
                    },
                    404: {
                        description: "Categoria não encontrado",
                        content: {
                            "application/json":{
                                example: {message: "Categoria não encontrado"}
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                    
                }
            }
        },
        "/subcategorias": {
             get: {
        tags:["Subcategorias"],
        summary: "Listar todas as subcategorias",
        responses: {
            200:{
                description: "Dados obtidos com sucesso!",
                content: {
                    "application/json":{
                        schema:{
                            type: "array",
                            items: {$ref: '#/components/schemas/Listar_Subcategoria'}
                        }
                    }
                }
            }
        }
            },
            post: {
    tags: ['Subcategorias'],
    summary: 'Cadastrar nova subcategoria',
    description: "Recebe nome, ativo e id_categoria",
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ["nome", "id_categoria"],
                    properties: {
                        nome: {
                            type: "string",
                            example: "Placas de Vídeo"
                        },
                        ativo: {
                            type: "boolean",
                            example: true
                        },
                        id_categoria: {
                            type: "integer",
                            example: 1
                        }
                    }
                }
            }
        }
    },
    responses: {
        201: { description: "Subcategoria cadastrada com sucesso!" },
        500: { description: "Erro interno no servidor" }
    }
        }
        },

        "/subcategorias/{id_subcategoria}": {
            put: {
        tags: ['Subcategorias'],
        summary: 'Atualizar subcategoria',
        parameters: [
            {
                name: "id_subcategoria",
                in: "path",
                required: true,
                schema: { type: 'integer', example: 1 }
            }
        ],
            requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            nome: {
                                type: "string",
                                example: "Processadores"
                            },
                            ativo: {
                                type: "boolean",
                                example: true
                            },
                            id_categoria: {
                                type: "integer",
                                example: 2
                            }
                        }
                    }
                }
            }
        },

        responses: {
            200: { description: "Atualizada com sucesso!" },
            404: { description: "Subcategoria não encontrada" },
            500: { description: "Erro interno" }
        }
           },

            delete: {
        tags: ['Subcategorias'],
        summary: 'Remover subcategoria',
        parameters: [
            {
                name: "id_subcategoria",
                in: "path",
                required: true,
                schema: { type: 'integer', example: 1 }
            }
        ],
        responses: {
            200: { description: "Removida com sucesso!" },
            404: { description: "Subcategoria não encontrada" },
            500: { description: "Erro interno" }
        }
          }
        },
   // ================= TRANSAÇÕES =================
        "/transacoes": {
            get: {
                tags:["Transações"],
                summary: "Listar todas as transações",
                responses: {
                    200:{
                        description: "Sucesso",
                        content: {
                            "application/json":{
                                schema:{
                                    type: "array",
                                    items: {$ref: '#/components/schemas/Listar_Transacoes'}
                                }
                            }
                        }
                    }
                }
            },

            post: {
                tags:['Transações'],
                summary: "Criar transação",
                requestBody: {
                    required: true,
                    content: {
                        "application/json":{
                            schema: {$ref: "#/components/schemas/Cadastrar_Transacao"}
                        }
                    }
                },
                responses: {
                    201: {description: "Criada com sucesso"},
                    400: {description: "Dados inválidos"},
                    500: {description: "Erro interno"}
                }
            }
        },

        "/transacoes/{id_transacao}": {
    get: {
        tags: ['Transações'],
        summary: "Buscar transação por ID",
        parameters: [
            {
                name: "id_transacao",
                in: "path",
                required: true,
                schema: { type: "integer", example: 1 }
            }
        ],
        responses: {
            200: {
                description: "Encontrada",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Listar_Transacoes" }
                    }
                }
            },
            404: { description: "Não encontrada" }
        }
    },

    put: {
        tags: ['Transações'],
        summary: "Atualizar transação por ID",
        parameters: [
            {
                name: "id_transacao",
                in: "path",
                required: true,
                schema: { type: "integer", example: 1 }
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/Atualizar_Transacao" }
                }
            }
        },
        responses: {
            200: { description: "Atualizada" },
            404: { description: "Não encontrada" }
        }
    },

    delete: {
        tags: ['Transações'],
        summary: "Deletar transação por ID",
        parameters: [
            {
                name: "id_transacao",
                in: "path",
                required: true,
                schema: { type: "integer", example: 1 }
            }
        ],
        responses: {
            200: { description: "Deletada" },
            404: { description: "Não encontrada" }
        }
    }
},


        "/transacoes/tipo/{tipo}": {
            get: {
                tags:["Transações"],
                summary: "Filtrar por tipo",
                parameters:[
                    {
                        name:"tipo",
                        in:"path",
                        required:true,
                        schema:{type:"string", enum:["E","S"]}
                    }
                ],
                responses:{
                    200:{
                        description:"Sucesso",
                        content:{
                            "application/json":{
                                schema:{
                                    type:"array",
                                    items:{$ref:"#/components/schemas/Listar_Transacoes"}
                                }
                            }
                        }
                    }
                }
            }
        },
        "/transacoes/periodo": {
            get: {
                tags:["Transações"],
                summary: "Filtrar transações por período",
                parameters:[
                    {
                        name:"inicio",
                        in:"query",
                        required:true,
                        description: "Data de início no formato de periodo",
                        schema:{type:"string", example:["10/04/2026"]}
                    },
                    {
                        name:"fim",
                        in:"query",
                        required:true,
                        description: "Data de fim no formato de periodo",
                        schema:{type:"string", example:["11/04/2026"]}
                    }
                ],
                responses:{
                    200:{
                        description:"Sucesso",
                        content:{
                            "application/json":{
                                schema:{
                                    type:"array",
                                    items:{$ref:"#/components/schemas/Listar_Transacoes"}
                                }
                            }
                        }
                    }
                }
            },
        },
        "/transacoes/total":{
            get: {
                tags:["Transações"],
                summary: "Listar todas as transações",
                description: "Retornaa a soma de todos os valores com base nos tipos informados E/S",
                // security: [{bearerAuth: []}],
                parameters: [{
                    name: "tipo",
                    in: 'query',
                    required: true,
                    description: "Tipo de transação E para Entrada S para Saida",
                    schema:{type: "string", enum: ["E", "S"]},
                    example:"E"
                }],
                responses: {
                    200:{
                        description: "Sucesso",
                        content: {
                            "application/json":{
                                schema:{
                                    type: "array",
                                    items: {$ref: '#/components/schemas/Total_Transacoes'}
                                }
                            }
                        }
                    }
                }
            },

        },
        "/dashboard/categorias":{
            get: {
                tags:["Dashboard"],
                summary: "Total de gastos por categoria",
                description: "Retornaa a soma das saidas agrupadas por categoria para o grafico",
                // security: [{bearerAuth: []}],
                parameters: [{
                    name: "tipo",
                    in: 'query',
                    required: true,
                    description: "Tipo de transação E para Entrada S para Saida",
                    schema:{type: "string", enum: ["E", "S"]},
                    example:"E"
                }],
                responses: {
                    200:{
                        description: "Sucesso",
                        content: {
                            "application/json":{
                                schema:{
                                    type: "array",
                                    items: {$ref: '#/components/schemas/Dashboard_Categoria'}
                                }
                            }
                        }
                    }
                }
            },
        },
        "/dashboard/maiores-gastos": {
    get: {
        tags: ["Dashboard"],
        summary: "Top 5 maiores despesas",
        description: "Retorna as 5 maiores despesas",
        // security: [{bearerAuth: []}],
        responses: {
            200: {
                description: "Sucesso",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    descricao: { 
                                        type: 'string', 
                                        example: "Aluguel de escritório" 
                                    },
                                    valor: { 
                                        type: 'number', 
                                        example: 1500.50 
                                    },
                                    data_registro: { 
                                        type: 'string', 
                                        format: 'date_time', 
                                        example: "15/05/2026"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
    },
    components:{
         securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Insira o token JWT gerado no login para acessar as rotas protegidas.'
            }
        },
        schemas:{
            Listar_Usuarios:{
                type: 'object',
                properties: {
                    id: {type: "integer", example: 1},
                    nome: {type: "string", example: "Ricardo"},
                    email: {type: "string", example: "ricardo@email.com"}
                }
            },
            Cadastrar_Usuario: {
                type: 'object',
                properties: {
                    nome: {type: "string", example: "Ricardo"},
                    email: {type: "string", example: "ricardo2@email.com"},
                    senha: {type: "string", example: "Senha123"}
                }
            },
            Atualizar_Usuario: {
                type: 'object',
                required: ["nome", "email", "senha"],
                properties: {
                    nome: {type: "string", example: "Nina"},
                    email: {type: "string", example: "nina@email.com"},
                    senha: {type: "string", example: "Senha123"}
                }
            },
            Login_Usuario : {
                type: 'object',
                required: ["email", "senha"],
                properties: {
                    nome: {type: "string", example: "Ricardo"},
                    email: {type: "string", example: "ricardo2@email.com"},
                    senha: {type: "string", example: "Senha123"}
                }
            },
            Resposta_Login : {
                type: 'object',
                properties:{
                message: {type: 'string', example: 'Login realizado com sucesso'},
                token:{
                    type: 'string',
                    description: 'Token JWT gerado',
                    example: 'addjasadks...'
                },
                usuario: {
                    type: 'object',
                    properties: {
                    id_usuario: {type: "string", example: 1},    
                    email: {type: "string", example: "ricardo@dasda"},
                    senha: {type: "string", example: "senha2323"},
                }
                }    
                }
            },
            Listar_Categorias:{
                type: 'object',
                properties: {
                    id_categoria: {type: "integer", example: 1},
                    nome: {type: "string", example: "Doces"},
                    descricao: {type: "string", example: "Comidas que são doces"},
                    cor: {type: "string", example: "#eab1d7"},
                    icone: {type: "string", example: "nomeIcone"},
                    tipo: {type: "string", example: "E"},
                    
                }
            },
            Cadastrar_Categorias: {
                type: 'object',
                properties: {
                    nome: {type: "string", example: "Salgado"},
                    descricao: {type: "string", example: "Salgados caseiros"},
                    tipo: {type: "string", example: "E"},
                    cor: {type: "string", example: "#b97e76"},
                    icone: {type: "string", example: "nomeIcone"}
                }
            },
            Atualizar_Categoria: {
                type: 'object',
                required: ["nome", "descricao", "tipo", "cor", "icone"],
                properties: {
                    nome: {type: "string", example: "nomeCategoria"},
                    descricao: {type: "string", example: "descriçãoCategoria"},
                    tipo: {type: "string", example: "tipoCategoria"},
                    cor: {type: "string", example: "corCategoria"},
                    icone: {type: "string", example: "iconeCategoria"}
                }
            },
            Listar_Transacoes: {
                type: 'object',
                properties: {
                    id_transacao: {type: "integer", example: 1},
                    valor: {type: "number", example: 100.00},
                    descricao: {type: "string", example: "Compra de mercadorias"},
                    data_registro: {type: "string", example: "01/01/2023"},
                    data_vencimento: {type: "string", example: "01/01/2023"},
                    data_pagamento: {type: "string", example: "01/01/2023"},
                    tipo: {type: "string", enum: ["E", "S"], example: "E"},
                    categoria: {type: "string", example: "Doces"},
                    subcategoria: {type: "string", example: "Bolos"}
                }
            },
            Cadastrar_Transacao:{
                type:'object',
                required:["valor","descricao","tipo","id_categoria"],
                properties:{
                    valor:{type:"number", example:100},
                    descricao:{type:"string"},
                    data_registro:{type:"string"},
                    tipo:{type:"string", enum:["E","S"]},
                    id_categoria:{type:"integer"},
                    id_subcategoria:{type:"integer"}
                }
            },
            Atualizar_Transacao:{
                type:'object',
                properties:{
                    valor:{type:"number"},
                    descricao:{type:"string"},
                    data_registro:{type:"string"},
                    tipo:{type:"string"},
                    id_categoria:{type:"integer"},
                    id_subcategoria:{type:"integer"}
                }
            },
            Total_Transacoes:{
                type: "object",
                properties: {
                    total:{
                        type: "number",
                        format: "float",
                        example: 1550.10,
                        description: "Soma Total dos calores das transacoes filtradas"
                    }
                }
            },
            Dashboard_Categoria:{
               type: "object",
                properties: {
                    nome: {
                        type: "string",
                        example: "Alimentação"
                    },
                    total:{
                        type: "number",
                        format: "float",
                        example: 1550.10,
                    }
                } 
            }

        }
    }
}
export default documentacao



