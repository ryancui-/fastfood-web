import {Component, OnInit} from '@angular/core';
import {Store} from '../../../store/store';
import {NzNotificationService} from 'ng-zorro-antd';
import {AuthService} from '../../../auth.service';

@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  isEdit = false;
  username;
  gender;

  uploadAvatarLoading = false;

  constructor(public store: Store,
              private authService: AuthService,
              private notificationService: NzNotificationService) {
  }

  ngOnInit() {
    this.username = this.store.user.username;
    this.gender = this.store.user.gender;
  }

  // 性别format
  formatGender(gender) {
    switch (gender) {
      case 1:
        return '男仔';
      case 2:
        return '女仔';
      default:
        return '大概是不男不女吧';
    }
  }

  // 保存个人资料修改
  save() {
    const params = {
      username: this.username,
      gender: this.gender
    };

    this.authService.modifyProfile(params).subscribe(({data}) => {
      this.notificationService.success('Yeah', '修改成功');
      this.isEdit = false;
      this.username = data.username;
      this.gender = data.gender;
    });
  }

  // 上传头像
  uploadAvatar(e) {
    const file = e.target.files[0];
    if (file.size > 500000) {
      this.notificationService.error('哎', '你上传的图片太大了喂');
      return;
    }

    this.uploadAvatarLoading = true;
    this.authService.uploadAvatar(file).subscribe(() => {
      this.uploadAvatarLoading = false;
      this.notificationService.success('Yeah', '上传成功');
    });
  }
}
