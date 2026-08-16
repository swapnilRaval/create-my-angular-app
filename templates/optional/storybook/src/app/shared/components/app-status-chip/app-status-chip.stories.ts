import type { Meta, StoryObj } from '@storybook/angular';
import { AppStatusChipComponent } from './app-status-chip.component';

const meta: Meta<AppStatusChipComponent> = {
  title: 'Shared/StatusChip',
  component: AppStatusChipComponent,
};

export default meta;

type Story = StoryObj<AppStatusChipComponent>;

export const Active: Story = {
  args: { active: true },
};

export const Inactive: Story = {
  args: { active: false },
};
