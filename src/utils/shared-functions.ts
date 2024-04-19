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

  delete entity.categories[index];
};

export const changeEntityRelated = async (
  repository: any,
  id: number,
  entity: any,
) => {
  if (entity[repository.metadata.name.toLowerCase()].id === id) {
    throw new BadRequestException(
      `${repository.metadata.name} is already related`,
    );
  }

  const entityRelated = await repository.findOne({
    where: { id },
  });

  if (!entityRelated) {
    throw new NotFoundException(`${repository.metadata.name} not found`);
  }

  entity[repository.metadata.name.toLowerCase()] = entityRelated;
};

export const addCartInOrder = async (
  cartRepository: any,
  userId: number,
  newOrder: any,
) => {
  const cart = await cartRepository.findOne({
    where: { user: { id: userId } },
    relations: { items: { product: { brand: true } } },
  });

  if (!cart) {
    throw new BadRequestException('The cart is empty');
  }

  newOrder.products = cart.items.map((item) => {
    return {
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      brand: { id: item.product.brand.id, name: item.product.brand.name },
    };
  });
};
