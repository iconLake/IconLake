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
