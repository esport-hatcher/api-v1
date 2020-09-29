#! /bin/sh

docker exec -it $(docker ps --filter "name=stack_api" -q | xargs) yarn ts-node -r tsconfig-paths/register /app/src/scripts/seeds
