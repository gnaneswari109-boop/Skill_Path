import React from 'react';
import { ChatView } from './ChatView';

interface MessagesViewProps {
  onOpenMemoryModal?: () => void;
  onNavigateTab?: (tab: string) => void;
  initialConversationId?: string;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  onOpenMemoryModal = () => {},
  onNavigateTab = () => {},
  initialConversationId
}) => {
  return (
    <ChatView
      onOpenMemoryModal={onOpenMemoryModal}
      onNavigateTab={onNavigateTab}
      initialConversationId={initialConversationId}
    />
  );
};
