package types

type IconDataI interface {
	GetAuthor() string
	GetName() string
	GetDescription() string
	GetCreateTime() string
}

type ClassDataI interface {
	GetAuthor() string
	GetCreateTime() string
}
