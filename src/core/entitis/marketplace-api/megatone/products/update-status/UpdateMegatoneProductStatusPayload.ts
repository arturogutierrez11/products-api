export interface UpdateMegatoneProductStatusPayload {
  userId: number;
  items: {
    publicationId: number;
    status: number; // 1 = ACTIVA, 2 = PAUSADA
  }[];
}
