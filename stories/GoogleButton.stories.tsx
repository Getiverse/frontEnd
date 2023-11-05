import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GoogleButton from '../components/buttons/GoogleButton';



// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Buttons/GoogleButton',
    component: GoogleButton,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof GoogleButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GoogleButton> = (args) => <GoogleButton {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
    children: 'Continue With Google',
    onClick: () => console.log("cippa lippa")
};
