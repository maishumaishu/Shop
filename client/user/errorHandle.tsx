import { Service } from 'user/services/service';
import { userData } from 'user/services/userData';
import { app } from 'application';
import { AppError, ErrorCodes } from 'share/common';
// import siteMap from 'siteMap';

// let container = document.createElement('div');
// container.className = 'admin-pc';
// document.body.appendChild(container);

// let alertElement = document.createElement('div');
// alertElement.className = 'modal fade';
// container.appendChild(alertElement);

Service.error.add((sender, err: AppError) => {

});