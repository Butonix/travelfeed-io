import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { saveAs } from 'file-saver';
import React from 'react';
import steem from 'steem';

const SteemKeys = props => {
  const { passPhrase } = props;

  const getPrivKeys = () => {
    const roles = ['active', 'owner', 'posting', 'memo'];
    return steem.auth.getPrivateKeys(props.username, passPhrase, roles);
  };

  const { active, owner, posting, memo } = getPrivKeys();
  const keyList = [
    {
      name: 'Passphrase',
      description:
        'The passphrase has all the permissions of your other keys. Write this down on paper and store it safely.',
      value: passPhrase,
    },
    {
      name: 'Owner',
      description: 'Store this offline or write it down on paper.',
      value: owner,
    },
    {
      name: 'Active',
      description:
        'The active key is needed to move funds from your account. Store this in a password manager.',
      value: active,
    },
    {
      name: 'Posting',
      description:
        'The posting key is needed to interact, e.g. login, post and vote. Store this in a password manager.',
      value: posting,
    },
    {
      name: 'Memo',
      description:
        'The memo key can be used  to encrypt and decrypt messages. Store this in a password manager.',
      value: memo,
    },
  ];

  const handleTxtSave = () => {
    const blob = new Blob([JSON.stringify(keyList)], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, 'travelfeed_steem_private_keys.txt');
  };

  return (
    <>
      <Typography variant="h5" className="pt-4" gutterBottom>
        Steem keys
      </Typography>
      <p>
        Your Steem keys cannot be recovered - if you forget them, you loose
        access to your account forever. This is why it is extremely important
        that you store them savely. We recommend to download your Steem keys and
        store them offline and/or print them out.
      </p>
      {keyList.map(k => (
        <FormGroup>
          <TextField label={k.name} margin="normal" value={k.value} fullWidth />
          <FormHelperText>{k.description}</FormHelperText>
        </FormGroup>
      ))}
      <Button variant="contained" color="primary" onClick={handleTxtSave}>
        Download keys
      </Button>
    </>
  );
};

export default SteemKeys;
