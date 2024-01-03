import { NotFoundException } from '@nestjs/common';

export const addOneEntity = async (
  repository: any,
  id: number,
  newEntity: any,
) => {
  const entity = await repository.findOneBy({
    id,
  });

  if (!entity) {
    throw new NotFoundException(`${repository.metadata.name} not found`);
  }

  delete entity.createdAt;
  delete entity.updatedAt;

  newEntity[repository.metadata.name.toLowerCase()] = entity;
};

export const addManyEntities = async (
  repository: any,
  ids: number[],
  newEntity: any,
) => {
  newEntity[repository.metadata.tableName] = [];

  for (const id of ids) {
    const entity = await repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(
        `${repository.metadata.name} with id ${id} not found`,
      );
    }

    delete entity.createdAt;
    delete entity.updatedAt;

    newEntity[repository.metadata.tableName].push(entity);
  }
};
