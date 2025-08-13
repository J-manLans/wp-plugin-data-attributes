<?php
/**
 * Plugin Name: Data Attributes
 * Description: Adds a single input for custom data-* attributes to blocks in the Advanced section in Gutenberg.
 * Version:     1.0.0
 * Author:      Joel Lansgren
 */

// Abort if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Load Gutenberg editor script
add_action( 'enqueue_block_editor_assets', function() {
    wp_enqueue_script(
        'data-attributes-editor',
        plugin_dir_url( __FILE__ ) . 'editor/index.js',
        [
            'wp-hooks',         // för addFilter
            'wp-compose',       // för createHigherOrderComponent
            'wp-block-editor',  // för InspectorControls etc.
            'wp-components',    // för PanelBody, TextControl
            'wp-element',       // för Fragment, createElement
        ],
        filemtime( plugin_dir_path( __FILE__ ) . 'editor/index.js' )
    );
});