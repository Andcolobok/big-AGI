import * as React from 'react';

import { Box, IconButton, ListDivider, ListItemDecorator, MenuItem, Switch, Tooltip } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import CompressIcon from '@mui/icons-material/Compress';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import HorizontalSplitOutlinedIcon from '@mui/icons-material/HorizontalSplitOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import VerticalSplitOutlinedIcon from '@mui/icons-material/VerticalSplitOutlined';

import type { DConversationId } from '~/common/state/store-chats';
import { KeyStroke } from '~/common/components/KeyStroke';
import { useOptimaDrawers } from '~/common/layout/optima/useOptimaDrawers';

import { useChatShowSystemMessages } from '../store-app-chat';
import { usePaneDuplicateOrClose } from './panes/usePanesManager';


export function ChatPageMenuItems(props: {
  isMobile: boolean,
  conversationId: DConversationId | null,
  hasConversations: boolean,
  isConversationEmpty: boolean,
  isMessageSelectionMode: boolean,
  onConversationBranch: (conversationId: DConversationId, messageId: string | null) => void,
  onConversationClear: (conversationId: DConversationId) => void,
  onConversationFlatten: (conversationId: DConversationId) => void,
  setIsMessageSelectionMode: (isMessageSelectionMode: boolean) => void,
}) {

  // external state
  const { closePageMenu } = useOptimaDrawers();
  const { canAddPane, isMultiPane, duplicateFocusedPane, removeOtherPanes } = usePaneDuplicateOrClose();
  const [showSystemMessages, setShowSystemMessages] = useChatShowSystemMessages();

  // derived state
  const disabled = !props.conversationId || props.isConversationEmpty;


  const handleToggleMultiPane = React.useCallback((_event: React.MouseEvent) => {
    if (isMultiPane)
      removeOtherPanes();
    else
      duplicateFocusedPane();
  }, [duplicateFocusedPane, isMultiPane, removeOtherPanes]);

  const handleIncreaseMultiPane = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    duplicateFocusedPane();
  }, [duplicateFocusedPane]);


  const closeMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    closePageMenu();
  };

  const handleConversationClear = (event: React.MouseEvent<HTMLDivElement>) => {
    closeMenu(event);
    props.conversationId && props.onConversationClear(props.conversationId);
  };

  const handleConversationBranch = (event: React.MouseEvent<HTMLDivElement>) => {
    closeMenu(event);
    props.conversationId && props.onConversationBranch(props.conversationId, null);
  };

  const handleConversationFlatten = (event: React.MouseEvent<HTMLDivElement>) => {
    closeMenu(event);
    props.conversationId && props.onConversationFlatten(props.conversationId);
  };

  const handleToggleMessageSelectionMode = (event: React.MouseEvent) => {
    closeMenu(event);
    props.setIsMessageSelectionMode(!props.isMessageSelectionMode);
  };

  const handleToggleSystemMessages = () => setShowSystemMessages(!showSystemMessages);


  return <>

    {/* System Message(s) */}
    <MenuItem onClick={handleToggleSystemMessages}>
      <ListItemDecorator><SettingsSuggestOutlinedIcon /></ListItemDecorator>
      System messages
      <Switch checked={showSystemMessages} onChange={handleToggleSystemMessages} sx={{ ml: 'auto' }} />
    </MenuItem>

    {/* Un /Split */}
    <MenuItem onClick={handleToggleMultiPane}>
      <ListItemDecorator>{props.isMobile
        ? (isMultiPane ? <HorizontalSplitIcon /> : <HorizontalSplitOutlinedIcon />)
        : (isMultiPane ? <VerticalSplitIcon /> : <VerticalSplitOutlinedIcon />)
      }</ListItemDecorator>
      {/* Unsplit / Split text*/}
      {isMultiPane ? 'Unsplit' : props.isMobile ? 'Split Down' : 'Split Right'}
      {/* '+' */}
      {isMultiPane && (
        <Tooltip title='Add Another Split'>
          <IconButton
            size='sm'
            variant='outlined'
            disabled={!canAddPane}
            onClick={handleIncreaseMultiPane}
            sx={{ ml: 'auto', /*mr: '2px',*/ my: '-0.25rem' /* absorb the menuItem padding */ }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </MenuItem>

    <ListDivider />

    <MenuItem disabled={disabled} onClick={handleConversationBranch}>
      <ListItemDecorator><ForkRightIcon /></ListItemDecorator>
      Branch
    </MenuItem>

    <MenuItem disabled={disabled} onClick={handleToggleMessageSelectionMode}>
      <ListItemDecorator>{props.isMessageSelectionMode ? <CheckBoxOutlinedIcon /> : <CheckBoxOutlineBlankOutlinedIcon />}</ListItemDecorator>
      <span style={props.isMessageSelectionMode ? { fontWeight: 800 } : {}}>
        Cleanup ...
      </span>
    </MenuItem>

    <MenuItem disabled={disabled} onClick={handleConversationFlatten}>
      <ListItemDecorator><CompressIcon color='success' /></ListItemDecorator>
      Compress ...
    </MenuItem>

    <ListDivider inset='startContent' />

    <MenuItem disabled={disabled} onClick={handleConversationClear}>
      <ListItemDecorator><ClearIcon /></ListItemDecorator>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        Reset Chat
        {!disabled && <KeyStroke combo='Ctrl + Alt + X' />}
      </Box>
    </MenuItem>

  </>;
}