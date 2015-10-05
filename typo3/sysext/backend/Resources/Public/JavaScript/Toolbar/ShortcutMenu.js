/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

/**
 * shortcut menu logic to add new shortcut, remove a shortcut
 * and edit a shortcut
 */
define('TYPO3/CMS/Backend/Toolbar/ShortcutMenu', ['jquery'], function($) {

	var ShortcutMenu = {
		$spinnerElement: $('<span>', {
			class: 'fa fa-circle-o-notch fa-spin'
		}),
		options: {
			containerSelector: '#typo3-cms-backend-backend-toolbaritems-shortcuttoolbaritem',
			toolbarIconSelector: '.dropdown-toggle .fa',
			toolbarMenuSelector: '.dropdown-menu',
			shortcutItemSelector: '.dropdown-menu .shortcut',
			shortcutDeleteSelector: '.shortcut-delete',
			shortcutEditSelector: '.shortcut-edit',
			shortcutFormTitleSelector: 'input[name="shortcut-title"]',
			shortcutFormGroupSelector: 'select[name="shortcut-group"]',
			shortcutFormSaveSelector: '.shortcut-form-save',
			shortcutFormCancelSelector: '.shortcut-form-cancel'
		}
	};

	/**
	 * build the in-place-editor for a shortcut
	 */
	ShortcutMenu.editShortcut = function($shortcutRecord) {
		// load the form
		$.ajax({
			url: TYPO3.settings.ajaxUrls['shortcut_editform'],
			data: {
				shortcutId: $shortcutRecord.data('shortcutid'),
				shortcutGroup: $shortcutRecord.data('shortcutgroup')
			},
			cache: false
		}).done(function(data) {
			$shortcutRecord.html(data);
		});
	};

	/**
	 * save the data from the in-place-editor for a shortcut
	 */
	ShortcutMenu.saveShortcutForm = function($shortcutRecord) {
		$.ajax({
			url: TYPO3.settings.ajaxUrls['shortcut_saveform'],
			data: {
				shortcutId: $shortcutRecord.data('shortcutid'),
				shortcutTitle: $shortcutRecord.find(ShortcutMenu.options.shortcutFormTitleSelector).val(),
				shortcutGroup: $shortcutRecord.find(ShortcutMenu.options.shortcutFormGroupSelector).val()
			},
			type: 'post',
			cache: false
		}).done(function(data) {
			// @todo: we can evaluate here, but what to do? a message?
			ShortcutMenu.refreshMenu();
		});
	};

	/**
	 * removes an existing short by sending an AJAX call
	 */
	ShortcutMenu.deleteShortcut = function($shortcutRecord) {
		// @todo: translations
		top.TYPO3.Modal.confirm('Delete bookmark', 'Do you really want to remove this bookmark?')
			.on('confirm.button.ok', function() {
				$.ajax({
					url: TYPO3.settings.ajaxUrls['shortcut_remove'],
					data: {
						shortcutId: $shortcutRecord.data('shortcutid')
					},
					type: 'post',
					cache: false
				}).done(function() {
					// a reload is used in order to restore the original behaviour
					// e.g. remove groups that are now empty because the last one in the group
					// was removed
					ShortcutMenu.refreshMenu();
				});
				$(this).trigger('modal-dismiss');
			})
			.on('confirm.button.cancel', function() {
				$(this).trigger('modal-dismiss');
			});
	};

	/**
	 * makes a call to the backend class to create a new shortcut,
	 * when finished it reloads the menu
	 */
	ShortcutMenu.createShortcut = function(moduleName, url, confirmationText, motherModule, shortcutButton) {
		if (typeof confirmationText !== 'undefined') {
			// @todo: translations
			top.TYPO3.Modal.confirm('Create bookmark', confirmationText)
				.on('confirm.button.ok', function() {
 					var $toolbarItemIcon = $(ShortcutMenu.options.toolbarIconSelector, ShortcutMenu.options.containerSelector);
					var $spinner = ShortcutMenu.$spinnerElement.clone();
					var $existingItem = $toolbarItemIcon.replaceWith($spinner);

					$.ajax({
						url: TYPO3.settings.ajaxUrls['shortcut_create'],
						type: 'post',
						data: {
							module: moduleName,
							url: url,
							motherModName: motherModule
						},
						cache: false
					}).done(function() {
						ShortcutMenu.refreshMenu();
						$spinner.replaceWith($existingItem);
						if (typeof shortcutButton === 'object') {
							$(shortcutButton).addClass('active');
							$(shortcutButton).attr('title', null);
							$(shortcutButton).attr('onclick', null);
						}
					});
					$(this).trigger('modal-dismiss');
				})
				.on('confirm.button.cancel', function() {
					$(this).trigger('modal-dismiss');
				});
		}

	};

	/**
	 * reloads the menu after an update
	 */
	ShortcutMenu.refreshMenu = function() {
		$.ajax({
			url: TYPO3.settings.ajaxUrls['shortcut_list'],
			type: 'get',
			cache: false
		}).done(function(data) {
			$(ShortcutMenu.options.toolbarMenuSelector, ShortcutMenu.options.containerSelector).html(data);
		});
	};

	/**
	 * Registers listeners
	 */
	ShortcutMenu.initializeEvents = function() {
		$(ShortcutMenu.options.containerSelector).on('click', ShortcutMenu.options.shortcutDeleteSelector, function(evt) {
			evt.preventDefault();
			evt.stopImmediatePropagation();
			ShortcutMenu.deleteShortcut($(this).closest(ShortcutMenu.options.shortcutItemSelector));
		}).on('click', ShortcutMenu.options.shortcutEditSelector, function(evt) {
			evt.preventDefault();
			evt.stopImmediatePropagation();
			ShortcutMenu.editShortcut($(this).closest(ShortcutMenu.options.shortcutItemSelector));
		}).on('click', ShortcutMenu.options.shortcutFormSaveSelector, function(evt) {
			ShortcutMenu.saveShortcutForm($(this).closest(ShortcutMenu.options.shortcutItemSelector));
		}).on('click', ShortcutMenu.options.shortcutFormCancelSelector, function() {
			// re-render the menu on canceling the update of a shortcut
			ShortcutMenu.refreshMenu();
		});
	};

	/**
	 * initialize and return the ShortcutMenu object
	 */
	return function() {
		$(document).ready(function() {
			ShortcutMenu.initializeEvents();
		});

		TYPO3.ShortcutMenu = ShortcutMenu;
		return ShortcutMenu;
	}();
});
