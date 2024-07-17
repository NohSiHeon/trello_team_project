export const MESSAGES = {
  AUTH: {
    COMMON: {
      EMAIL: {
        REQUIRED: '이메일을 입력해 주세요.',
        INVALID_FORMAT: '이메일 형식이 올바르지 않습니다.',
      },
      PASSWORD: {
        REQUIRED: '비밀번호을 입력해 주세요.',
        MIN_LENGTH: `비밀번호는 8자리 이상이어야 합니다.`,
        INVALID_FORMAT:
          '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다.',
      },
      PASSWORD_CONFIRM: {
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        NOT_MATCHED_WITH_PASSWORD: '입력 한 두 비밀번호가 일치하지 않습니다.',
      },
      NAME: {
        REQUIRED: '이름을 입력해 주세요.',
      },
      NICKNAME: {
        REQUIRED: '닉네임을 입력해 주세요.',
      },
      PHONE_NUMBER: {
        REQUIRED: '전화번호를 입력해 주세요.',
        INVALID_FORMAT: '전화번호 형식(000-000-000)에 맞게 입력해주세요. ',
      },
      DUPLICATED: '이미 가입된 사용자 입니다.',
      UNAUTHORIZED: '인증 정보가 유효하지 않습니다.',
      FORBIDDEN: '접근 권한이 없습니다.',
      NOT_FOUND: '해당하는 사용자를 찾을 수 없습니다.',
      JWT: {
        NO_TOKEN: '인증 정보가 없습니다.',
        NOT_SUPPORTED_TYPE: '지원하지 않는 인증방식 입니다.',
        EXPIRED: '인증 정보가 만료 되었습니다',
        NO_USER: '인증 정보와 일치하는 사용자가 없습니다.',
        INVALID: '인증 정보가 유효하지 않습니다.',
        DISCARDED_TOKEN: '폐기된 인증 정보입니다.',
      },
      MEMBER: {
        NO_USER: '멤버 식별에 필요한 사용자 정보를 입력해주세요.',
        NO_BOARD: '멤버 식별에 필요한 보드 정보를 입력해주세요.',
      },
    },
    SIGN_UP: {
      SECCEED: '회원가입에 성공했습니다.',
    },
    SIGN_IN: {
      SECCEED: '로그인에 성공했습니다.',
    },
  },
  USERS: {
    COMMON: {
      NOT_FOUND: '해당하는 사용자를 찾을 수 없습니다.',
    },
    READ_ME: {
      SUCCEED: '내 정보 조회에 성공했습니다.',
    },
    UPDATE_ME: {
      SUCCEED: '내 정보 수정에 성공했습니다.',
      NO_BODY_DATA: '수정할 데이터를 입력해주세요',
      DUPLICATED_EMAIL: '현재와 동일한 이메일입니다.',
    },
    DELETE_ACCOUNT: {
      SUCCEED: '회원 탈퇴에 성공했습니다.',
      FAIL: '회원 탈퇴에 실패했습니다.',
      ALREADY_DELETED: '이미 탈퇴한 회원입니다.',
      ADMIN_CANNOT_DELETE:
        '어드민 유저는 탈퇴할 수 없습니다. 관리자 권한을 다른 사람에게 넘겨야 합니다.',
    },
    CHECK_EMAIL_REGISTRATION: {
      REGISTERED: '이 이메일은 이미 등록된 상태입니다.',
      NOT_REGISTERED: '이 이메일은 등록되지 않은 상태입니다.',
      DEACTIVATED: '이 이메일은 탈퇴한 상태입니다.',
    },
  },
  BOARD: {
    COMMON: {
      NOT_MEMBER: '보드에 추가된 유저가 아닙니다.',
    },
  },
};
