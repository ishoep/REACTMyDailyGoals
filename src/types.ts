export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completed: boolean;
  color?: string;
}

export type SortOption = 'priority' | 'dueDate' | 'title';