import { BadRequestException, NotFoundException } from '@nestjs/common';

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

    newEntity[repository.metadata.tableName].push(entity);
  }
};

export const addCategory = async (repository: any, id: number, entity: any) => {
  const category = await repository.findOne({ where: { id } });

  if (!category) {
    throw new NotFoundException(`Category not found`);
  }

  const isRepeated = entity.categories.some((category) => category.id === id);

  if (isRepeated) {
    const nameEntity = entity.price ? 'product' : 'brand';
    throw new BadRequestException(
      `The category already exists in the ${nameEntity}`,
    );
  }

  entity[repository.metadata.tableName].push(category);
};

export const removeCategory = (entity: any, categoryId: number) => {
  const nameEntity = entity.price ? 'product' : 'brand';

  const index = entity.categories.findIndex(
    (category) => category.id === categoryId,
  );

  if (index === -1) {
    throw new NotFoundException('Category not found in ' + nameEntity);
  }

  if (entity.categories.length === 1) {
    throw new BadRequestException(
      `The ${nameEntity} must have at least one category`,
    );
  }

  delete entity.categories[index];
};