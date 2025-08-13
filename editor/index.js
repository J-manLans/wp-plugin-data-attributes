/**
 * Editor script for Data Attributes plugin (no build step, uses WordPress globals)
 */
(function(wp) {
    const { addFilter } = wp.hooks;
    const { createHigherOrderComponent } = wp.compose;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, TextControl } = wp.components;
    const { Fragment } = wp.element;

    // 1) Register new attribute for all blocks (or filter specific blocks)
    addFilter('blocks.registerBlockType', 'data-attributes/add-attribute', (settings) => {
        if (typeof settings.attributes !== 'undefined') {
            settings.attributes = Object.assign({}, settings.attributes, {
                customDataAttributes: { type: 'string', default: '' },
            });
        }
        return settings;
    });

    // 2) Add data field to the advanced section in the sidebar
    const withCustomDataField = createHigherOrderComponent((BlockEdit) => {
        return (props) => {
            const { attributes, setAttributes } = props;

            return wp.element.createElement(
                Fragment,
                null,
                wp.element.createElement(BlockEdit, props),
                wp.element.createElement(
                    wp.blockEditor.InspectorAdvancedControls,
                    null,
                    wp.element.createElement(TextControl, {
                        label: 'Data attributes',
                        value: attributes.customDataAttributes,
                        onChange: (value) => setAttributes({ customDataAttributes: value }),
                        help: 'Enter data attributes, e.g. data-three-d="true" data-perspective="1000". For multiple attributes separate them with a space.',
                    })
                )
            );
        };
    }, 'withCustomDataField');
    
    addFilter('editor.BlockEdit', 'data-attributes/with-custom-data-field', withCustomDataField);

    // 3) Output attributes in saved HTML
    addFilter('blocks.getSaveContent.extraProps','data-attributes/apply-custom-data', (extraProps, blockType, attributes) => {
        const str = attributes.customDataAttributes;
        
        if (str && typeof str === 'string') {
            const regex = /(data-[\w-]+)\s*=\s*"([^"]*)"/g;
            let match;
            while ((match = regex.exec(str)) !== null) {
                extraProps[match[1]] = match[2];
            }
        }
        return extraProps;
    } );
})(window.wp);
