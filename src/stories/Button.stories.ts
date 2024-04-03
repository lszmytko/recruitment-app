import type { Meta, StoryObj } from "@storybook/react";
import RefreshPageButton from "../Tags/RefreshPageButton";

const meta: Meta<typeof RefreshPageButton> = {
  component: RefreshPageButton,
};

export default meta;
type Story = StoryObj<typeof RefreshPageButton>;

export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
};
