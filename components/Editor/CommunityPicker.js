import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { communities } from '../../helpers/communities';

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: 120,
  },
}));

const CommunityPicker = props => {
  const classes = useStyles();

  const { isDisabled } = props;

  const [community, setCommunity] = React.useState(props.value);

  const handleChange = event => {
    setCommunity(event.target.value);
    props.onCommunityChange(event.target.value);
  };

  const picker = (
    <div className="pb-2">
      <FormControl className={classes.formControl}>
        <InputLabel id="community-picker-label">Community</InputLabel>
        <Select
          disabled={isDisabled}
          labelId="community-picker-label"
          id="community-picker"
          value={community}
          onChange={handleChange}
        >
          {communities.map(({ tag, title }) => {
            return <MenuItem value={tag}>{title}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </div>
  );

  if (isDisabled)
    return (
      <Tooltip
        title="You cannot change the community after publishing"
        placement="bottom-start"
      >
        {picker}
      </Tooltip>
    );

  return picker;
};

export default CommunityPicker;
