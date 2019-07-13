'use strict'

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const GObject = imports.gi.GObject;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init(){

}

function buildPrefsWidget(){
    // Get the Setting's schema
    this.schema = Gio.SettingsSchemaSource.new_from_directory(
        Me.dir.get_child('schemas').get_path(),
        Gio.SettingsSchemaSource.get_default(),
        false
    );

    // Load the schema values
    this.settings = new Gio.Settings({
        settings_schema: this.schema.lookup('castcontrol.hello.lukearran.com', true)
    });


    // Create a parent widget that we'll return from this function
    let layout = new Gtk.Grid({
        margin: 50,
        column_spacing: 12,
        row_spacing: 12,
        visible: true
    });
    
    // Add a simple title and add it to the layout
    let title = new Gtk.Label({
        label: `<b>${Me.metadata.name} Settings</b>`,
        halign: Gtk.Align.START,
        use_markup: true,
        visible: true
    });
    layout.attach(title, 0, 0, 2, 1);
    
    // Auto Start Control
    let autoStartLabel = new Gtk.Label({
        label: ' Automatic Start Cast API ',
        halign: Gtk.Align.START,
        visible: true
    });
    layout.attach(autoStartLabel, 0, 1, 1, 1);
    
    let autoStartSwitchControl = new Gtk.Switch({
        visible: true,
        margin_right: 100
    });

    var isAuto = this.settings.get_value("auto-castapi").deep_unpack();

    autoStartSwitchControl.set_state(isAuto);

    layout.attach(autoStartSwitchControl, 1, 1, 1, 1);

    // API Hostname
    let hostnameLabel = new Gtk.Label({
        label: ' API Hostname Custom Endpoint',
        halign: Gtk.Align.START,
        visible: true
    });
    layout.attach(hostnameLabel, 0, 2, 1, 2);
    
    let hostnameTextbox = new Gtk.Entry({
        visible: true
    });

    var hostnameValue = this.settings.get_value("castapi-hostname").deep_unpack();

    hostnameTextbox.set_text(hostnameValue);

    layout.attach(hostnameTextbox, 1, 2, 2, 2);

    // API Port
    let portLabel = new Gtk.Label({
        label: ' API Port Custom Endpoint ',
        halign: Gtk.Align.START,
        visible: true
    });
    layout.attach(portLabel, 0, 4, 1, 3);
    
    let portTextbox = new Gtk.SpinButton({
        visible: true,
        numeric: true,
        snap_to_ticks: true,
        climb_rate: 1
    });

    var serverPortValue = this.settings.get_value("castapi-port").deep_unpack();

    portTextbox.set_range(1000, 9999);
    portTextbox.set_increments(1, 1);
    portTextbox.set_value(serverPortValue);

    layout.attach(portTextbox, 1, 4, 1, 3);

    // Refresh Interval
    let refreshIntervalLabel = new Gtk.Label({
        label: ' Refresh Interval (Sec) ',
        halign: Gtk.Align.START,
        visible: true
    });
    layout.attach(refreshIntervalLabel, 0, 7, 1, 3);
    
    let refreshIntervalTextbox = new Gtk.SpinButton({
        visible: true,
        numeric: true,
        climb_rate: 1
    });

    var serverRefreshIntervalValue = this.settings.get_value("refresh-interval-ms").deep_unpack() / 1000;

    refreshIntervalTextbox.set_range(1, 9999);
    refreshIntervalTextbox.set_increments(1, 1);
    refreshIntervalTextbox.set_value(serverRefreshIntervalValue);

    layout.attach(refreshIntervalTextbox, 1, 7, 1, 3);

    // Save Button
    let saveButton = new Gtk.Button({
        label: ' Save Changes ',
        visible: true
    });

    // On the Save Button clicked, apply settings
    saveButton.connect('clicked', (button) => {
        // Auto Start API
        this.settings.set_value(
            'auto-castapi',
            new GLib.Variant('b', autoStartSwitchControl.get_state())
        );
        // Hostname
        this.settings.set_value(
            'castapi-hostname',
            new GLib.Variant('s', hostnameTextbox.get_text())
        );
        // Port
        this.settings.set_value(
            'castapi-port',
            new GLib.Variant('i', portTextbox.get_value())
        );
        // Refresh Interval
        this.settings.set_value(
            'refresh-interval-ms',
            new GLib.Variant('i', refreshIntervalTextbox.get_value() * 1000)
        );
    });

    layout.attach(saveButton, 15, 50, 7, 3);

    return layout;
}