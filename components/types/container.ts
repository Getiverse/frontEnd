interface Container {
    children: React.ReactNode,
    /**background color or image*/
    bg?: String,
    className?: string,
    relative?: boolean,
    /**
     * Shows the sidebar and Header for desktop screen
     */
    showSidebarAndHeader?: boolean
}

export default Container;