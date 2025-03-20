package types

type IconDataRawI interface {
	GetAuthor() []byte
	GetName() string
	GetDescription() string
	GetCreateTime() int64
}

type ClassDataRawI interface {
	GetAuthor() []byte
	GetCreateTime() int64
}

type CreatorRawI interface {
	GetAddress() []byte
	GetName() string
	GetDescription() string
	GetAvatar() string
	GetAvatarHash() string
	GetMedias() []*Media
	GetSex() string
	GetBirthday() string
	GetLocation() string
}
