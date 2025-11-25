export type Recipe = {  
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  difficulty: string;
  estimatedTime: string;
  imageUrl?: string;
  category?: string;
  comments?: Comment[];
}

export type Comment = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}
