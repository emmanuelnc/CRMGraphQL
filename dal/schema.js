const { gql } = require ('apollo-server');


//schema, type definition -- Minimo, ok
const typeDefs = gql`

  type Token {
    token : String
  }
  type Producto {
    id: ID
    nombre : String
    existencia: Int
    precio : Float
    creado: String
    
  }
  
  type Cliente {
    id : ID
    nombre : String
    apellido : String
    empresa : String
    email : String
    telefono : String
    vendedor :ID
  }

  
  type Pedido {
    id: ID
    pedido: [PedidoGrupo]
    total: Float
    cliente: ID
    vendedor: ID
    fecha: String
    estado: EstadoPedido
  }

  type PedidoGrupo {
    id: ID
    cantidad: Int
  }

  type TopCliente{
    total  : Float
    cliente : [Cliente]
  }

  type TopVendedor{
    total  : Float
    vendedor : [Usuario]
  }

  type Usuario {
    id : ID
    nombre : String
    apellido : String
    email : String
    creado : String
  }

  input UsuarioInput {
    nombre : String!
    apellido : String!
    email : String!
    password : String!
    
  }

  input AutenticarInput {
    email : String!
    password : String!
  }

  input ProductoInput{
    nombre : String!
    existencia: Int!
    precio: Float!
  }

  input ClienteInput {
    nombre : String!
    apellido : String!
    empresa : String!
    email : String!
    telefono : String
    
  }

  input PedidoProductoInput{
    id: ID
    cantidad : Int
  }

  input PedidoInput {
    pedido : [PedidoProductoInput]
    total: Float
    cliente: ID
    estado: EstadoPedido
  }

  enum EstadoPedido{
    PENDIENTE
    COMPLETADO
    CANCELADO
  }


type Query
    {
      obtenerCurso : String
      ObtenerUsuario : Usuario
      
      
     #Productos
      obtenerProductos : [Producto]
      obtenerProducto (id: ID!) : Producto

    #Cliente
      obtenerClientes : [Cliente]
      obtenerClientesVendedor : [Cliente]
      obtenerCliente (id: ID!) : Cliente

    # Pedidos
    obtenerPedidos: [Pedido]
    obtenerPedidosvendedor: [Pedido]
    obtenerPedido(id:ID!) : Pedido
    obtenerPedidosEstado(estado: String!) : [Pedido]
    
    #Busquedas Avanzadas
    mejoresClientes : [TopCliente]
    mejoresVendedores : [TopVendedor]
    buscarProducto(texto: String!) : [Producto]


      
    }

 type Mutation{
   #Usuarios
      nuevoUsuario(input: UsuarioInput) : Usuario
      autenticarusuario(input: AutenticarInput) : Token

   #Productos
    nuevoProducto(input: ProductoInput) : Producto
    actualizarProducto(id: ID!, input: ProductoInput): Producto
    eliminaProducto (id :ID!) : String

  #Clientes
    nuevoCliente (input: ClienteInput) : Cliente
    actualizarCliente(id:ID!, input: ClienteInput) : Cliente
    eliminaCliente (id : ID!) : String
  

    #Pedidos
    nuevoPedido(input : PedidoInput) : Pedido
    actualizarPedido(id:ID!, input: PedidoInput) : Pedido
    eliminarPedido(id: ID!) : String


    }
`;

module.exports = typeDefs;