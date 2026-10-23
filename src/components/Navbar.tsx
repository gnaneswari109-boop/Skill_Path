import React from 'react';
import { Header } from './Header';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSupabaseModal: () => void;
  onOpenAIGuide: () => void;
  onOpenMemoryModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSupabaseModal,
  onOpenAIGuide,
  onOpenMemoryModal
}) => {
  return (
    <Header
      currentTab={currentTab}
      onOpenMobileMenu={() => {}}
      onOpenAIGuide={onOpenAIGuide}
      onOpenSupabaseModal={onOpenSupabaseModal}
      onOpenMemoryModal={onOpenMemoryModal}
      onSelectTab={onSelectTab}
    />
  );
};
