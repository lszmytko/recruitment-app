import type { Meta, StoryObj } from "@storybook/react";
import Tags from "@/Tags/Tags";

const meta: Meta<typeof Tags> = {
  title: "Tags",
  component: Tags,
};

export default meta;
type Story = StoryObj<typeof Tags>;

export const TagsComponent: Story = {};
