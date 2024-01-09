export abstract class BaseEntity {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
