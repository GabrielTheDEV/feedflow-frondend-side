#!/bin/bash

# Script para facilitar o uso de Docker no projeto FeedFlow

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== FeedFlow Docker Helper ===${NC}\n"

if [ -z "$1" ]; then
  echo "Uso: ./docker-dev.sh [comando]"
  echo ""
  echo "Comandos disponíveis:"
  echo "  install   - Instala dependências e inicia"
  echo "  dev       - Inicia o servidor de desenvolvimento"
  echo "  build     - Constrói a imagem Docker"
  echo "  stop      - Para os containers"
  echo "  logs      - Mostra os logs"
  echo "  shell     - Abre um shell no container"
  exit 1
fi

case "$1" in
  install)
    echo -e "${BLUE}Instalando dependências e iniciando...${NC}"
    docker-compose up --build
    ;;
  dev)
    echo -e "${BLUE}Iniciando servidor de desenvolvimento...${NC}"
    docker-compose up
    ;;
  build)
    echo -e "${BLUE}Construindo imagem Docker...${NC}"
    docker-compose build
    ;;
  stop)
    echo -e "${BLUE}Parando containers...${NC}"
    docker-compose down
    ;;
  logs)
    echo -e "${BLUE}Mostrando logs...${NC}"
    docker-compose logs -f
    ;;
  shell)
    echo -e "${BLUE}Abrindo shell no container...${NC}"
    docker-compose exec feedflow sh
    ;;
  *)
    echo -e "${RED}Comando desconhecido: $1${NC}"
    exit 1
    ;;
esac
