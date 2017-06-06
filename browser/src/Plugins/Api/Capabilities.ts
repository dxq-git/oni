/**
 * Capabilities.ts
 *
 * Export utility types / functions for working with plugin capabilities
 */

/**
 * ActivationMode describes the policy in which the plugin should be activated.
 * `immediate` means the plugin will be executed at startup,
 * `on-demand` means the plugin will be executed when it encounters a command or event it can handle
 */
export type ActivationMode = "immediate" | "on-demand"

export interface Capabilities {
    languageService?: string[]
    subscriptions?: string[]
    commands?: { [commandName: string]: ICommandInfo }
}

export interface ICommandInfo {
    name: string
    details: string
}

/**
 * Interface describing 
 */
export interface IPluginFilter {
    fileType: string
    requiredCapabilities: Capabilities
    singlePlugin?: boolean
}

export const createPluginFilter = (fileType: string, requiredCapabilities?: Capabilities, isSinglePlugin?: boolean) => ({
    fileType,
    requiredCapabilities,
    singlePlugin: isSinglePlugin,
})

export const createPluginFilterForCommand = (fileType: string, command: string) => {
    const commands = {}
    commands[command] = null
    return createPluginFilter(fileType, {
        commands,
    }, true)
}

export interface IPluginMetadata {
    name: string
    main: string
    engines: any
    oni: IPluginCapabilities
}

export interface IPluginCapabilities extends Capabilities {
    activationMode?: ActivationMode
    supportedFileTypes?: string[]
}

/**
 * Returns true if the metadata matches the filter, false otherwise
 */
export const doesMetadataMatchFilter = (metadata: IPluginMetadata, filter: IPluginFilter) => {

    if (!filter) {
        return true
    }

    const expectedFileType = filter.fileType

    if (!metadata.oni) {
        return false
    }

    if (!doesPluginSupportFiletype(metadata.oni, expectedFileType)) {
        return false
    }

    const requiredCapabilities = filter.requiredCapabilities

    if (!requiredCapabilities) {
        return true
    }

    return doCapabilitiesMeetRequirements()
}

export const doesPluginSupportFiletype = (pluginCapabilities: IPluginCapabilities, fileType: string) => {

    if (!pluginCapabilities.supportedFileTypes || !pluginCapabilities.supportedFileTypes.length) {
        return false
    }

    const matches = pluginCapabilities.supportedFileTypes.filter((ft) => {
            return ft === "*" || ft === fileType
    })

    return matches.length > 0
}

export const doCapabilitiesMeetRequirements = () => {
    return true
}
