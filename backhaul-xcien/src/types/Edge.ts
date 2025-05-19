
export interface EdgeData {
  id: string;
  source: string;
  target: string;
  capacity?: number;
  usage?: number;
}

export interface Edge {
  data: EdgeData;
}

