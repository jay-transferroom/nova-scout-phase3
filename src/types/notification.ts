
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationType = 
  | 'scout_management'
  | 'status_update'
  | 'player_tracking'
  | 'xtv_change'
  | 'injury'
  | 'transfer'
  | 'availability'
  | 'market_tracking'
  | 'comparable_players'
  | 'players_of_interest'
  | 'questions'
  | 'chatbot';

export interface NotificationSettings {
  scout_management: boolean;
  status_update: boolean;
  player_tracking: boolean;
  xtv_change: boolean;
  injury: boolean;
  transfer: boolean;
  availability: boolean;
  market_tracking: boolean;
  comparable_players: boolean;
  players_of_interest: boolean;
  questions: boolean;
  chatbot: boolean;
}
