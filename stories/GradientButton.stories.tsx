import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GradientButton from '../components/buttons/GradientButton';



// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Buttons/GradientButton',
    component: GradientButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof GradientButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GradientButton> = (args) => <GradientButton {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
    children: 'Login',
    onClick: () => console.log("cippa lippa")
};

//export const Secondary = Template.bind({});
//Secondary.args = {
//  label: 'Button',
//};

//export const Large = Template.bind({});
//Large.args = {
//  size: 'large',
//  label: 'Button',
//};

//export const Small = Template.bind({});
//Small.args = {
//  size: 'small',
//  label: 'Button',
//};
