# Prova - Desenvolvedor C# DNA Specialty

## Descrição

**AngularDNA** é um projeto que combina um backend em **.NET 8** com um frontend em **Angular** (utilizando o template **PrimeNG Sakai**). O backend fornece uma API RESTful para gerenciar usuários, produtos, clientes e pedidos, enquanto o frontend consome essa API.

## Estrutura do Projeto

### Backend (**AngularDNA.Server**)

- **Tecnologia**: .NET 8
- **Pasta Principal**: `AngularDNA.Server`
- **Arquivos Importantes**:
  - `Program.cs`: Configuração principal do aplicativo, incluindo serviços e middleware.
  - `DataContext.cs`: Configuração do **Entity Framework Core**.
  - `Controllers/`: Contém os controladores da API:
    - `UsuariosController.cs`
    - `ProdutosController.cs`
    - `ClientesController.cs`
    - `PedidosController.cs`
  - `Models/`: Contém os modelos de dados:
    - `Usuario.cs`
    - `Produto.cs`
    - `Cliente.cs`
    - `Pedido.cs`
  - `Migrations/`: Contém os arquivos de migração do Entity Framework Core.

### Frontend (**angulardna.client**)

- **Tecnologia**: Angular + PrimeNG (template Sakai)
- **Pasta Principal**: `angulardna.client`
- **Arquivos Importantes**:
  - `src/app.config.ts`: Configuração principal do aplicativo Angular.
  - `src/app/pages/service/`: Contém os serviços Angular:
    - `usuario.service.ts`
    - `produto.service.ts`
    - `cliente.service.ts`
    - `pedido.service.ts`
  - `src/environments/`: Contém os arquivos de configuração de ambiente:
    - `environment.ts`
    - `environment.prod.ts`

## Configuração e Execução

### Backend

#### 1. **Pré-requisitos**

- .NET 8 SDK
- SQL Server

#### 2. **Configuração**

- Configure a string de conexão do banco de dados no arquivo `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=AngularDNA;Trusted_Connection=True;"
  }
}
```

#### 3. **Execução**

- Navegue até a pasta `AngularDNA.Server` e execute os seguintes comandos:

```sh
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

- O backend está configurado para servir o frontend automaticamente usando o **SPA Proxy**. A configuração está definida no arquivo `.csproj`:

```xml
<SpaRoot>..\angulardna.client</SpaRoot>
<SpaProxyLaunchCommand>npm start</SpaProxyLaunchCommand>
<SpaProxyServerUrl>https://localhost:49484</SpaProxyServerUrl>
```

- Com essa configuração, o backend iniciará o frontend automaticamente ao rodar `dotnet run`.

### Frontend

#### 1. **Pré-requisitos**

- Node.js
- Angular CLI

#### 2. **Configuração**

- Configure a URL da API no arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5084/api'
};
```

#### 3. **Execução**

- Caso prefira rodar o frontend separadamente, navegue até a pasta `angulardna.client` e execute os seguintes comandos:

```sh
npm install
ng serve
```

## Funcionalidades

### Backend

- **Cadastro de Usuários**:

  - Nome do Usuário
  - CPF
  - Login
  - Senha

- **Cadastro de Produtos**:

  - Nome do Produto
  - Preço

- **Cadastro de Clientes**:

  - CNPJ
  - Razão Social

- **Criação de Pedidos**:

  - Seleção do cliente
  - Digitação de quantidades do produto
  - Cálculo do total do pedido
  - Geração do pedido com exibição do usuário que o digitou

### Frontend

- **Serviços para Consumo da API**:
  - `usuario.service.ts`
  - `produto.service.ts`
  - `cliente.service.ts`
  - `pedido.service.ts`

## Estrutura de Pastas

```
AngularDNA/
├── AngularDNA.Server/
│   ├── Controllers/
│   │   ├── UsuariosController.cs
│   │   ├── ProdutosController.cs
│   │   ├── ClientesController.cs
│   │   ├── PedidosController.cs
│   ├── Data/
│   │   └── DataContext.cs
│   ├── Models/
│   │   ├── Usuario.cs
│   │   ├── Produto.cs
│   │   ├── Cliente.cs
│   │   ├── Pedido.cs
│   ├── Migrations/
│   └── Program.cs
├── angulardna.client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   │   └── service/
│   │   │   │       ├── usuario.service.ts
│   │   │   │       ├── produto.service.ts
│   │   │   │       ├── cliente.service.ts
│   │   │   │       ├── pedido.service.ts
│   │   │   └── app.config.ts
│   │   ├── environments/
│   │   │   ├── environment.ts
│   │   │   └── environment.prod.ts
│   │   └── index.html
└── README.md
```

## Licença

Este projeto está licenciado sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Para mais informações, entre em contato via e-mail: [visofo@gmail.com](mailto\:visofo@gmail.com).

