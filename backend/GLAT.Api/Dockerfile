FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore "./GLAT.Api.csproj"
RUN dotnet publish "./GLAT.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENV LD_LIBRARY_PATH=/app
EXPOSE 8080

ENTRYPOINT ["dotnet", "GLAT.Api.dll"]