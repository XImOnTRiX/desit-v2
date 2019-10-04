import React, { Component } from 'react';
import { connect } from 'react-redux';

import { NavLink } from 'react-router-dom';

import { simpleFetch, determine } from '../../../redux/actions';
import { ACTIVE_VIEW_POST, GET_USER } from '../../../redux/actions/type';

import { ROOT_URL, GET_COLLECTION, GET_USER_API, masterkey } from '../../../config';

import { Container, Row, Button, Column, Title, Text, Image, Tag, Divider, SubTitle } from '../../../ui';
import { FbShare } from '../../../assets/components/share';

import { secondsToDate } from '../../../assets/utils/dateConverter';
import { renderTags } from '../../../assets/utils/renderTags';

import BlogLatest from '../blogLatest';
import { HeaderHalf } from '../../../assets/components/header';
import { Head, MoveBackNav } from './styled';

class SinglePost extends Component {
  componentDidMount() {
    setTimeout(() => {
      if(this.props.history.action === "PUSH") {
        window.scrollTo({top: 0})
      }
    },250);

    if(this.props.blogList !== null) {
      const { blogList } = this.props;
      const searchValue = this.props.match.params.id;

      for(var i = 0; i < blogList.length; i++) {
        if(blogList[i].title_slug === searchValue) {
          this.props.determine(ACTIVE_VIEW_POST, {entries: [blogList[i]]})
          return;
        }
      }
    } else {
      let newConfig = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filter: { published: true, title_slug: this.props.match.params.id },
          limit: 1,
          skip: 0,
          populate: 1,
        })
      }
      this.props.simpleFetch(ACTIVE_VIEW_POST, `${ROOT_URL + GET_COLLECTION}/blogposts?token=${masterkey}`, newConfig);
      if(this.props.user.userList === null) {
        this.props.simpleFetch(GET_USER, `${ROOT_URL + GET_USER_API}?token=${masterkey}`);
      }
    }
  }

  writtenBy = (user, data) => {
    console.log(user.userList, data);
    for(let i = 0; i < user.length; i++) {
      if(user[i]._id === data._by) {
        return <NavLink to="/team/user"><span className="link" style={{fontWeight: '600'}}>{user[i].name}</span></NavLink>
      }
    }
  }

  renderSinglePost = (passedData) => {
    if(this.props.post !== null && this.props.user.userList !== null) {
      let data = passedData.entries[0];
      console.log(data);
      return (
        <>
          <Title variant="h1" size="medium">{data.title}</Title>
          <Text
            weight="400"
            style={{color: '#a6a6a6'}}
            size="xsmall"
          >
            von {this.writtenBy(this.props.user, data)} - {secondsToDate(data._created)}
          </Text>
          <Text size="small">
            {renderTags(data.tags)}
          </Text>
          <Container nop style={{margin: '10px 0'}} >
            <div className="singlePostStyle" dangerouslySetInnerHTML={{__html: data.content}} />
          </Container>
        </>
      );
    }
  }


  render() {
    return (
      <>
      <Container full nop style={{background: 'white'}}>
        <Head image={ this.props.post !== null ? ROOT_URL + '/storage/uploads' + this.props.post.entries[0].image.path : null } />

        <Container big style={{paddingTop: '50px'}}>
          <Row>
            <Column ml={8}>
                {this.renderSinglePost(this.props.post)}
            </Column>
            <Column nop md={4}>
              <div style={{height: '100%', width: '100%', background: '#ebebeb'}}>
                <div style={{height: '500px', widht: '100%', background: 'grey', position: 'sticky', top: '100px'}}>

                </div>
              </div>
            </Column>
            <Column s={12}>
              <Divider />
              <Row>
                <Column s={12} md={6} style={{padding: '0'}}>
                  <MoveBackNav passed={this.props.history} />
                </Column>
                <Column s={12} md={6} nop>
                  <Row justify="flex-end">
                    <div style={{background: '#2b2b2b', width: '30px', height: '30px', borderRadius: '100%', marginRight: '10px'}} ></div>
                    <div style={{background: '#2b2b2b', width: '30px', height: '30px', borderRadius: '100%', marginRight: '10px'}} ></div>
                    <div style={{background: '#2b2b2b', width: '30px', height: '30px', borderRadius: '100%', marginRight: '10px'}} ></div>
                  </Row>
                </Column>
              </Row>
            </Column>
          </Row>

          <Row style={{marginTop: '50px'}}>
            <Column s={12}>
              <SubTitle color="primary" size="small" >weitere</SubTitle>
              <Title variant="h4" size="medium">Ähnliche Beiträge wie dieser</Title>
            </Column>
          </Row>
          <Row>
            <BlogLatest />
          </Row>
        </Container>
      </Container>
      </>
    );
  }
}


const mapStateToProps = (data) => {
  return {
    post: data.blog.thisPost,
    user: data.user,
    blogList: data.blog.blogList,
  }
}

export default connect(
  mapStateToProps,
  { simpleFetch, determine }
)(SinglePost)
