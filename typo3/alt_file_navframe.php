<?php
/***************************************************************
 *  Copyright notice
 *
 *  (c) 1999-2013 Kasper Skårhøj (kasperYYYY@typo3.com)
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *  A copy is found in the textfile GPL.txt and important notices to the license
 *  from the author is found in LICENSE.txt distributed with these scripts.
 *
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/
/**
 * Folder tree in the File main module.
 *
 * Revised for TYPO3 3.6 2/2003 by Kasper Skårhøj
 * XHTML compliant
 *
 * @author Kasper Skårhøj <kasperYYYY@typo3.com>
 */
$BACK_PATH = '';
require_once 'init.php';

// Make instance if it is not an AJAX call
if (!(TYPO3_REQUESTTYPE & TYPO3_REQUESTTYPE_AJAX)) {
	$SOBE = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('TYPO3\\CMS\\Backend\\Controller\\FileSystemNavigationFrameController');
	$SOBE->init();
	$SOBE->initPage();
	$SOBE->main();
	$SOBE->printContent();
}
?>