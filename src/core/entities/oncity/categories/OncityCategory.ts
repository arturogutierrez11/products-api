export interface OncityCategory {
  id: number;
  name: string;
  hasChildren?: boolean;
  children?: OncityCategory[];
}
