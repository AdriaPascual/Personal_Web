FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY PersonalWebAPI/PersonalWebAPI.csproj PersonalWebAPI/
COPY PersonalWebCore/PersonalWebCore.csproj PersonalWebCore/
COPY PersonalWebInfrastructure/PersonalWebInfrastructure.csproj PersonalWebInfrastructure/
RUN dotnet restore PersonalWebAPI/PersonalWebAPI.csproj

COPY PersonalWebAPI/ PersonalWebAPI/
COPY PersonalWebCore/ PersonalWebCore/
COPY PersonalWebInfrastructure/ PersonalWebInfrastructure/
RUN dotnet publish PersonalWebAPI/PersonalWebAPI.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# Render espera que el contenedor escuche en el puerto que expone;
# ASPNETCORE_HTTP_PORTS (.NET 8+) es la forma simple de fijarlo sin protocolo/host.
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

# Desactiva el FileSystemWatcher que ASP.NET Core crea por defecto sobre
# appsettings.json (recarga en caliente). Usa inotify, y un contenedor que se
# redespliega en cada cambio no lo necesita; además un ciclo de crashes puede
# agotar el límite de instancias de inotify del contenedor (128 por defecto)
# y dejarlo en un bucle de arranque fallido permanente hasta recrearlo.
ENV hostBuilder__reloadConfigOnChange=false

ENTRYPOINT ["dotnet", "PersonalWebAPI.dll"]
