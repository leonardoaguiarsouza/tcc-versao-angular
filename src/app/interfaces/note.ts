export interface Note {
    id?: string,
    title: string,
    content: string,
    createdAt?: Date,
    lastModify?: Date,
    active?: boolean,
    user?: string
  }