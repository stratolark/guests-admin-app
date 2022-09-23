import React from 'react';

import ADD from './svg/add.svg';
import ARROWRIGHT from './svg/arrowright.svg';
import ATTACHFILE from './svg/attachfile.svg';
import BATHROOM from './svg/bathroom.svg';
import CALENDAR from './svg/calendar.svg';
import CARD from './svg/card.svg';
import CHECKMARK from './svg/checkmark.svg';
import CHEVRONRIGHT from './svg/chevronright.svg';
import CUSTOMIZE from './svg/customize.svg';
import CLOSE from './svg/close.svg';
import COMMENT from './svg/comment.svg';
import DOLLAR from './svg/dollar.svg';
import DOOROPEN from './svg/dooropen.svg';
import DOOR from './svg/door.svg';
import EDIT from './svg/edit.svg';
import EXPENSE from './svg/expense.svg';
import FINANCE from './svg/finance.svg';
import GASTANK from './svg/gastank.svg';
import HASH from './svg/hash.svg';
import HOME from './svg/home.svg';
import INVOICE from './svg/invoice.svg';
import INVOICEDOLLAR from './svg/invoicedollar.svg';
import LASTPAYMENT from './svg/lastpayment.svg';
import LIGHTBULB from './svg/lightbulb.svg';
import LOCK from './svg/lock.svg';
import LOGOUT from './svg/logout.svg';
import MAIL from './svg/mail.svg';
import MENU from './svg/menu.svg';
import MONEY from './svg/money.svg';
import NEXTPAYMENT from './svg/nextpayment.svg';
import PAYMENT from './svg/payment.svg';
import PHONE from './svg/phone.svg';
import QUESTION from './svg/question.svg';
import RENTER from './svg/renter.svg';
import ROOMRENTED from './svg/roomrented.svg';
import ROUTER from './svg/router.svg';
import SPINNER from './svg/spinner.svg';
import STOCK from './svg/stock.svg';
import TIME from './svg/time.svg';
import TOOLBOX from './svg/toolbox.svg';
import USERPART from './svg/userpart.svg';
import USER from './svg/user.svg';
import WATERDROP from './svg/waterdrop.svg';
import WRENCH from './svg/wrench.svg';
import WRENCH2 from './svg/wrench2.svg';

const components = {
  add: ADD,
  arrowright: ARROWRIGHT,
  attachfile: ATTACHFILE,
  bathroom: BATHROOM,
  calendar: CALENDAR,
  card: CARD,
  checkmark: CHECKMARK,
  chevronright: CHEVRONRIGHT,
  close: CLOSE,
  comment: COMMENT,
  customize: CUSTOMIZE,
  dollar: DOLLAR,
  dooropen: DOOROPEN,
  door: DOOR,
  edit: EDIT,
  expense: EXPENSE,
  finance: FINANCE,
  gastank: GASTANK,
  hash: HASH,
  home: HOME,
  invoice: INVOICE,
  invoicedollar: INVOICEDOLLAR,
  lastpayment: LASTPAYMENT,
  lightbulb: LIGHTBULB,
  lock: LOCK,
  logout: LOGOUT,
  mail: MAIL,
  menu: MENU,
  money: MONEY,
  nextpayment: NEXTPAYMENT,
  payment: PAYMENT,
  phone: PHONE,
  question: QUESTION,
  renter: RENTER,
  roomrented: ROOMRENTED,
  router: ROUTER,
  spinner: SPINNER,
  stock: STOCK,
  time: TIME,
  toolbox: TOOLBOX,
  userpart: USERPART,
  user: USER,
  waterdrop: WATERDROP,
  wrench: WRENCH,
  wrench2: WRENCH2,
};
export type Icons = keyof typeof components;

type IconProps = {
  kind: Icons;
  divCss?: string;
  svgCss?: string;
};

const Icon = ({ kind, divCss = '', svgCss = '', ...rest }: IconProps) => {
  // if (
  //   !href ||
  //   (kind === 'mail' &&
  //     !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href))
  // )
  //   return null;

  const Svg = components[kind];

  return (
    <div className={`z-auto ${divCss}`} {...rest}>
      <span className='sr-only'>{kind}</span>
      <Svg className={`z-auto ${svgCss}`} />
    </div>
  );
};

export default React.memo(Icon);
