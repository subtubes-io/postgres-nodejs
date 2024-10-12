import { BaseRepository } from "./baseRepository";

interface UserEventResponse {
  count: number;
}

interface UserEventQueryParams {
  customerId: string;
  eventDate: number;
  eventName: string;
}

export class UserEventRepository extends BaseRepository {
  constructor() {
    super();
  }

  async getCount(
    queryParams: UserEventQueryParams
  ): Promise<UserEventResponse> {
    const response = await this.axios.get<UserEventResponse>(
      `/scheduler/customer-events-count/`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  // {
  //   scheduleExpression: "In1Minute",
  //   customerId: "4f93db97-f8ea-41c3-9198-aff4e95546f2",
  //   eventName: "abandoned_cart",
  //   eventDate: epochTime,
  // }
  async createEvent(body: any): Promise<any> {
    const sixHoursAgo = Date.now() - 8 * 60 * 60 * 1000;
    const epochTime = Math.floor(sixHoursAgo / 1000);

    const response = await this.axios.post(`/scheduler`, body);

    return response;
  }

  async seed(body: any): Promise<any> {
    const response = await this.axios.post(`/scheduler/seed`, body);
  }
}
