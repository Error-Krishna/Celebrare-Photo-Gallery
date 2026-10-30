/**
 * Photo interface representing the Picsum Photos API response item.
 * Endpoint: https://picsum.photos/v2/list?limit=30
 */
export interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}
