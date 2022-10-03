import React from "react";
import { Meta, Story } from "@storybook/react";
import { WishlistProvider } from "../src";

const meta: Meta = {
  title: "Welcome",
  component: WishlistProvider,
  argTypes: {
    children: {
      control: {
        type: "text",
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (args) => <WishlistProvider {...args} />;

export const Default = Template.bind({});

Default.args = {};
