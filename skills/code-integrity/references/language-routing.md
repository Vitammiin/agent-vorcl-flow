# Language routing

| Ecosystem | Frontend/templates | Backend/runtime | Mock signals |
|---|---|---|---|
| TS/JS | React, Vue, Svelte, Angular, HTML | Node, Bun, Deno, serverless | MSW, Jest/Vitest, Sinon, Nock, Faker |
| Python | Jinja/Django templates | Django, Flask, FastAPI | unittest.mock, responses, httpx mocking, Faker |
| Go | html/template | net/http, Gin, Echo, Fiber | gomock, testify/mock, httpmock, gofakeit |
| Java/Kotlin | Thymeleaf/JSP/Compose | Spring, Jakarta, Ktor | Mockito, WireMock, MockWebServer, Java Faker |
| C# | Razor/Blazor | ASP.NET | Moq, NSubstitute, WireMock.Net, Bogus |
| PHP | Blade/Twig | Laravel, Symfony | Mockery, PHPUnit mocks, Faker |
| Ruby | ERB/Haml | Rails, Sinatra | RSpec doubles, WebMock, VCR, Faker |
| Rust | Askama/Tera/HTML | Axum, Actix, Rocket | mockall, httpmock, fake |

Use language-specific tooling if already present, but never install or execute project code merely to improve this audit. Text scanning provides candidates; imports, build configuration, routes, templates, and call sites provide proof.
