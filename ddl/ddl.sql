CREATE TABLE `USERS` (
  `ID` bigint(9) unsigned zerofill NOT NULL AUTO_INCREMENT COMMENT 'システムで自動採番されるユーザーID',
  `EMAIL` varchar(128) NOT NULL COMMENT 'Ｅメールアドレス',
  `AVF` date NOT NULL COMMENT '世代管理用の日付',
  `NAME` varchar(128) DEFAULT NULL COMMENT 'ユーザー情報に表示されるユーザー名を保持する。',
  `PASSWORD` char(60) DEFAULT NULL,
  `LOCKED` tinyint(1) unsigned DEFAULT '0' COMMENT 'アカウントがロックされていることを示すフラグ',
  `EXPIRED` tinyint(1) unsigned DEFAULT '0' COMMENT 'アカウントが期限切れになったことを示すフラグ',
  `EMP_NO` char(8) DEFAULT NULL,
  `DEPT_CD` char(7) DEFAULT NULL,
  `POS_CD` char(4) DEFAULT NULL,
  `PROFILE_IMG` LONGTEXT DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `EMAIL` (`EMAIL`,`AVF`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

CREATE TABLE `USER_ROLES` (
  `USER_ID` bigint(9) unsigned zerofill NOT NULL COMMENT 'ユーザーマスタのユーザーIDを参照',
  `ROLE` char(2) NOT NULL,
  `DELFLG` char(1) DEFAULT NULL COMMENT 'ユーザーが無効化された場合に設定される削除フラグ',
  PRIMARY KEY (`USER_ID`,`ROLE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

CREATE TABLE `PERSONAL_INFO` (
  `USER_ID` bigint(9) unsigned zerofill NOT NULL,
  `USER_NAME` varchar(32) DEFAULT NULL,
  `ABOUT_ME` varchar(256) DEFAULT NULL,
  `ZIPCODE` char(7) DEFAULT NULL,
  `PREF` varchar(16) DEFAULT NULL,
  `CITY` varchar(128) DEFAULT NULL,
  `BLDG` varchar(128) DEFAULT NULL,
  `TELNO` varchar(32) DEFAULT NULL,
  `MOBILE_NO` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `USER_HOBBYS` (
  `USER_ID` bigint(9) unsigned zerofill NOT NULL COMMENT 'ユーザーマスタのユーザーIDを参照',
  `NAME` varchar(128) DEFAULT NULL COMMENT 'ユーザー情報に表示されるユーザー名を保持する。',
  `EMP_NO` char(8) DEFAULT NULL,
  `HOBBY` varchar(30) DEFAULT NULL COMMENT 'ユーザーの趣味情報を保持する。',
   PRIMARY KEY(`USER_ID`, `HOBBY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `CODEMST` (
  `CODE_ID` bigint(8) unsigned zerofill NOT NULL COMMENT 'コード体系を一意にしきべつするためのID',
  `CODE` varchar(8) NOT NULL,
  `CODE_NM` varchar(256) DEFAULT NULL,
  `DELFLG` char(1) DEFAULT NULL COMMENT 'ユーザーが無効化された場合に設定される削除フラグ',
  PRIMARY KEY (`CODE_ID`,`CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `DEPTS` (
  `DEPT_CD` char(7) NOT NULL,
  `AVF` date NOT NULL,
  `DEPT_NM` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`DEPT_CD`,`AVF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `POSITIONS` (
  `POS_CD` char(4) NOT NULL,
  `AVF` date NOT NULL,
  `POS_NM` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`POS_CD`,`AVF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

CREATE TABLE `NUMBERING_LEDGER` (
  `NUMBERING_CD` varchar(3) NOT NULL,
  `AVAIL_YEAR` varchar(4) NOT NULL,
  `NEXTNO` decimal(9,0) DEFAULT NULL,
  `DIGITS` decimal(9,0) DEFAULT NULL,
  `UPDUSR` bigint(9) unsigned zerofill DEFAULT NULL,
  `UPDDATE` date DEFAULT NULL,
  PRIMARY KEY (`NUMBERING_CD`,`AVAIL_YEAR`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE TOPICS
(
    TOPICNO         VARCHAR(12) NOT NULL,
    SUBJECT         VARCHAR(128) DEFAULT NULL,
    CREATEDBY       VARCHAR(8) DEFAULT NULL,
    CREATEDAT        DATE DEFAULT NULL,
    PRIMARY KEY (TOPICNO)
)ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

CREATE TABLE POSTS (
    TOPICNO         VARCHAR(12) NOT NULL,
    POSTNO          BIGINT(8) UNSIGNED ZEROFILL,
    POST            VARCHAR(1280) DEFAULT NULL,
    POST_IMG 		LONGTEXT DEFAULT NULL,
    CREATEDBY       VARCHAR(8) DEFAULT NULL,
    CREATEDAT       DATE DEFAULT NULL,
    PRIMARY KEY (TOPICNO, POSTNO)
)ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

CREATE TABLE POST_RATINGS (
    TOPICNO         VARCHAR(12) NOT NULL,
    POSTNO          BIGINT(8) UNSIGNED ZEROFILL NOT NULL,
    RATEDBY         VARCHAR(8) NOT NULL,
    RATING_FLG      TINYINT DEFAULT NULL,
    RATEDAT         DATE DEFAULT NULL,
    PRIMARY KEY(TOPICNO, POSTNO, RATEDBY)
)ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

CREATE TABLE `MESSAGE_HIST` (
  `MESSAGE_ID` bigint(9) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `FROM_USER_ID` bigint(9) unsigned zerofill NOT NULL,
  `MESSAGE` TEXT COMMENT '65,535文字までのメッセージが格納可能',
  `MESSAGE_IMG` LONGTEXT DEFAULT NULL,
  `SENT_AVF` TIMESTAMP NOT NULL COMMENT 'メッセージ送信日',
  `TO_USER_ID` bigint(9) unsigned zerofill,
  `DELETE_FLG` INT DEFAULT 0,
  PRIMARY KEY (`MESSAGE_ID`,`FROM_USER_ID`,`SENT_AVF`,`TO_USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
