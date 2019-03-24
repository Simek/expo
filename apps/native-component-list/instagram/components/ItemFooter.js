import React from 'react';
import { Text, View } from 'react-native';

import NavigationService from '../navigation/NavigationService';
import { IconBar } from './FeedList';
export class ItemFooter extends React.Component {
  static defaultProps = {
    comments: [
      'this ain it chief',
      'THANSO CAT',
      'people who pretend to be programmers on instagram are lame...',
    ],
    date: 'August 29',
  };

  openComments = () => {
    NavigationService.navigate('Profile_Comments', {
      comments: this.props.comments,
    });
  };
  render() {
    const { name, description, date, comments } = this.props;
    return (
      <View style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
        <IconBar />
        <Text style={{ marginTop: 6 }}>
          <Text style={{ fontWeight: '600', color: '#262626', fontSize: 14 }}>{name}</Text>{' '}
          {description}
        </Text>
        {comments && comments.length && (
          <Text
            onPress={this.openComments}
            style={{ paddingVertical: 8, fontSize: 14, opacity: 0.6 }}>
            View all {comments.length} comments
          </Text>
        )}
        <Text style={{ fontSize: 10, color: '#999' }}>{date.toUpperCase()}</Text>
      </View>
    );
  }
}
