// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: iconlake/icon/tx.proto

package types

import (
	context "context"
	fmt "fmt"
	grpc1 "github.com/cosmos/gogoproto/grpc"
	proto "github.com/cosmos/gogoproto/proto"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	io "io"
	math "math"
	math_bits "math/bits"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.GoGoProtoPackageIsVersion3 // please upgrade the proto package

type MsgMint struct {
	Creator     string `protobuf:"bytes,1,opt,name=creator,proto3" json:"creator,omitempty"`
	ClassId     string `protobuf:"bytes,2,opt,name=classId,proto3" json:"classId,omitempty"`
	Id          string `protobuf:"bytes,3,opt,name=id,proto3" json:"id,omitempty"`
	Name        string `protobuf:"bytes,4,opt,name=name,proto3" json:"name,omitempty"`
	Description string `protobuf:"bytes,5,opt,name=description,proto3" json:"description,omitempty"`
	Uri         string `protobuf:"bytes,6,opt,name=uri,proto3" json:"uri,omitempty"`
	UriHash     string `protobuf:"bytes,7,opt,name=uriHash,proto3" json:"uriHash,omitempty"`
	Supply      uint64 `protobuf:"varint,9,opt,name=supply,proto3" json:"supply,omitempty"`
}

func (m *MsgMint) Reset()         { *m = MsgMint{} }
func (m *MsgMint) String() string { return proto.CompactTextString(m) }
func (*MsgMint) ProtoMessage()    {}
func (*MsgMint) Descriptor() ([]byte, []int) {
	return fileDescriptor_86a033f3437d40ab, []int{0}
}
func (m *MsgMint) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *MsgMint) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_MsgMint.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *MsgMint) XXX_Merge(src proto.Message) {
	xxx_messageInfo_MsgMint.Merge(m, src)
}
func (m *MsgMint) XXX_Size() int {
	return m.Size()
}
func (m *MsgMint) XXX_DiscardUnknown() {
	xxx_messageInfo_MsgMint.DiscardUnknown(m)
}

var xxx_messageInfo_MsgMint proto.InternalMessageInfo

func (m *MsgMint) GetCreator() string {
	if m != nil {
		return m.Creator
	}
	return ""
}

func (m *MsgMint) GetClassId() string {
	if m != nil {
		return m.ClassId
	}
	return ""
}

func (m *MsgMint) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *MsgMint) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *MsgMint) GetDescription() string {
	if m != nil {
		return m.Description
	}
	return ""
}

func (m *MsgMint) GetUri() string {
	if m != nil {
		return m.Uri
	}
	return ""
}

func (m *MsgMint) GetUriHash() string {
	if m != nil {
		return m.UriHash
	}
	return ""
}

func (m *MsgMint) GetSupply() uint64 {
	if m != nil {
		return m.Supply
	}
	return 0
}

type MsgMintResponse struct {
}

func (m *MsgMintResponse) Reset()         { *m = MsgMintResponse{} }
func (m *MsgMintResponse) String() string { return proto.CompactTextString(m) }
func (*MsgMintResponse) ProtoMessage()    {}
func (*MsgMintResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_86a033f3437d40ab, []int{1}
}
func (m *MsgMintResponse) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *MsgMintResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_MsgMintResponse.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *MsgMintResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_MsgMintResponse.Merge(m, src)
}
func (m *MsgMintResponse) XXX_Size() int {
	return m.Size()
}
func (m *MsgMintResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_MsgMintResponse.DiscardUnknown(m)
}

var xxx_messageInfo_MsgMintResponse proto.InternalMessageInfo

type MsgUpdateClass struct {
	Creator     string `protobuf:"bytes,1,opt,name=creator,proto3" json:"creator,omitempty"`
	Id          string `protobuf:"bytes,2,opt,name=id,proto3" json:"id,omitempty"`
	Name        string `protobuf:"bytes,3,opt,name=name,proto3" json:"name,omitempty"`
	Symbol      string `protobuf:"bytes,4,opt,name=symbol,proto3" json:"symbol,omitempty"`
	Description string `protobuf:"bytes,5,opt,name=description,proto3" json:"description,omitempty"`
	Uri         string `protobuf:"bytes,6,opt,name=uri,proto3" json:"uri,omitempty"`
	UriHash     string `protobuf:"bytes,7,opt,name=uriHash,proto3" json:"uriHash,omitempty"`
}

func (m *MsgUpdateClass) Reset()         { *m = MsgUpdateClass{} }
func (m *MsgUpdateClass) String() string { return proto.CompactTextString(m) }
func (*MsgUpdateClass) ProtoMessage()    {}
func (*MsgUpdateClass) Descriptor() ([]byte, []int) {
	return fileDescriptor_86a033f3437d40ab, []int{2}
}
func (m *MsgUpdateClass) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *MsgUpdateClass) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_MsgUpdateClass.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *MsgUpdateClass) XXX_Merge(src proto.Message) {
	xxx_messageInfo_MsgUpdateClass.Merge(m, src)
}
func (m *MsgUpdateClass) XXX_Size() int {
	return m.Size()
}
func (m *MsgUpdateClass) XXX_DiscardUnknown() {
	xxx_messageInfo_MsgUpdateClass.DiscardUnknown(m)
}

var xxx_messageInfo_MsgUpdateClass proto.InternalMessageInfo

func (m *MsgUpdateClass) GetCreator() string {
	if m != nil {
		return m.Creator
	}
	return ""
}

func (m *MsgUpdateClass) GetId() string {
	if m != nil {
		return m.Id
	}
	return ""
}

func (m *MsgUpdateClass) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *MsgUpdateClass) GetSymbol() string {
	if m != nil {
		return m.Symbol
	}
	return ""
}

func (m *MsgUpdateClass) GetDescription() string {
	if m != nil {
		return m.Description
	}
	return ""
}

func (m *MsgUpdateClass) GetUri() string {
	if m != nil {
		return m.Uri
	}
	return ""
}

func (m *MsgUpdateClass) GetUriHash() string {
	if m != nil {
		return m.UriHash
	}
	return ""
}

type MsgUpdateClassResponse struct {
}

func (m *MsgUpdateClassResponse) Reset()         { *m = MsgUpdateClassResponse{} }
func (m *MsgUpdateClassResponse) String() string { return proto.CompactTextString(m) }
func (*MsgUpdateClassResponse) ProtoMessage()    {}
func (*MsgUpdateClassResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_86a033f3437d40ab, []int{3}
}
func (m *MsgUpdateClassResponse) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *MsgUpdateClassResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_MsgUpdateClassResponse.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *MsgUpdateClassResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_MsgUpdateClassResponse.Merge(m, src)
}
func (m *MsgUpdateClassResponse) XXX_Size() int {
	return m.Size()
}
func (m *MsgUpdateClassResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_MsgUpdateClassResponse.DiscardUnknown(m)
}

var xxx_messageInfo_MsgUpdateClassResponse proto.InternalMessageInfo

func init() {
	proto.RegisterType((*MsgMint)(nil), "iconlake.icon.MsgMint")
	proto.RegisterType((*MsgMintResponse)(nil), "iconlake.icon.MsgMintResponse")
	proto.RegisterType((*MsgUpdateClass)(nil), "iconlake.icon.MsgUpdateClass")
	proto.RegisterType((*MsgUpdateClassResponse)(nil), "iconlake.icon.MsgUpdateClassResponse")
}

func init() { proto.RegisterFile("iconlake/icon/tx.proto", fileDescriptor_86a033f3437d40ab) }

var fileDescriptor_86a033f3437d40ab = []byte{
	// 355 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xac, 0x52, 0x4f, 0x4b, 0xf3, 0x30,
	0x18, 0x5f, 0xda, 0xbe, 0x1b, 0x7b, 0xc6, 0x3b, 0x35, 0x60, 0x09, 0x83, 0x95, 0x51, 0x10, 0x76,
	0xea, 0x40, 0xef, 0x1e, 0xf4, 0xa2, 0x87, 0x5e, 0x26, 0x5e, 0xbc, 0x48, 0xb6, 0x86, 0x19, 0xec,
	0xda, 0xd0, 0x64, 0xb0, 0x7d, 0x0b, 0xcf, 0x7e, 0x0e, 0xbf, 0x83, 0x1e, 0x77, 0xf4, 0x28, 0xdb,
	0x17, 0x91, 0xa4, 0xa9, 0x74, 0x4c, 0x76, 0xf2, 0x12, 0x7e, 0x7f, 0x1e, 0xf2, 0xe4, 0x97, 0xe7,
	0x01, 0x9f, 0x4f, 0xf3, 0x2c, 0xa5, 0xcf, 0x6c, 0xa4, 0xc1, 0x48, 0x2d, 0x23, 0x51, 0xe4, 0x2a,
	0xc7, 0xff, 0x2b, 0x3d, 0xd2, 0xa0, 0xd7, 0xdf, 0x2d, 0xd3, 0xc7, 0x63, 0x42, 0x15, 0x2d, 0xab,
	0xc3, 0x77, 0x04, 0xad, 0x58, 0xce, 0x62, 0x9e, 0x29, 0x4c, 0xa0, 0x35, 0x2d, 0x18, 0x55, 0x79,
	0x41, 0xd0, 0x00, 0x0d, 0xdb, 0xe3, 0x8a, 0x1a, 0x27, 0xa5, 0x52, 0xde, 0x26, 0xc4, 0xb1, 0x4e,
	0x49, 0x71, 0x17, 0x1c, 0x9e, 0x10, 0xd7, 0x88, 0x0e, 0x4f, 0x30, 0x06, 0x2f, 0xa3, 0x73, 0x46,
	0x3c, 0xa3, 0x18, 0x8c, 0x07, 0xd0, 0x49, 0x98, 0x9c, 0x16, 0x5c, 0x28, 0x9e, 0x67, 0xe4, 0x9f,
	0xb1, 0xea, 0x12, 0x3e, 0x06, 0x77, 0x51, 0x70, 0xd2, 0x34, 0x8e, 0x86, 0xba, 0xe3, 0xa2, 0xe0,
	0x37, 0x54, 0x3e, 0x91, 0x56, 0xd9, 0xd1, 0x52, 0xec, 0x43, 0x53, 0x2e, 0x84, 0x48, 0x57, 0xa4,
	0x3d, 0x40, 0x43, 0x6f, 0x6c, 0x59, 0x78, 0x02, 0x47, 0x36, 0xc8, 0x98, 0x49, 0x91, 0x67, 0x92,
	0x85, 0x6f, 0x08, 0xba, 0xb1, 0x9c, 0xdd, 0x8b, 0x84, 0x2a, 0x76, 0xad, 0x5f, 0x7c, 0x20, 0x63,
	0x99, 0xc4, 0xd9, 0x4b, 0xe2, 0xd6, 0x92, 0xe8, 0xde, 0xab, 0xf9, 0x24, 0x4f, 0x6d, 0x3e, 0xcb,
	0xfe, 0x36, 0x61, 0x48, 0xc0, 0xdf, 0x7d, 0x75, 0x15, 0xe8, 0xfc, 0x15, 0x81, 0x1b, 0xcb, 0x19,
	0xbe, 0x04, 0xcf, 0x4c, 0xcc, 0x8f, 0x76, 0x86, 0x1d, 0xd9, 0x0f, 0xe8, 0x05, 0xbf, 0xeb, 0xd5,
	0x3d, 0xf8, 0x0e, 0x3a, 0xf5, 0x4f, 0xe9, 0xef, 0x97, 0xd7, 0xec, 0xde, 0xd9, 0x41, 0xbb, 0xba,
	0xf4, 0x6a, 0xf4, 0xb1, 0x09, 0xd0, 0x7a, 0x13, 0xa0, 0xaf, 0x4d, 0x80, 0x5e, 0xb6, 0x41, 0x63,
	0xbd, 0x0d, 0x1a, 0x9f, 0xdb, 0xa0, 0xf1, 0x70, 0xfa, 0xb3, 0x83, 0x4b, 0xbb, 0xac, 0x2b, 0xc1,
	0xe4, 0xa4, 0x69, 0x56, 0xf0, 0xe2, 0x3b, 0x00, 0x00, 0xff, 0xff, 0x43, 0xf6, 0x2d, 0xc1, 0xca,
	0x02, 0x00, 0x00,
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// MsgClient is the client API for Msg service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type MsgClient interface {
	Mint(ctx context.Context, in *MsgMint, opts ...grpc.CallOption) (*MsgMintResponse, error)
	UpdateClass(ctx context.Context, in *MsgUpdateClass, opts ...grpc.CallOption) (*MsgUpdateClassResponse, error)
}

type msgClient struct {
	cc grpc1.ClientConn
}

func NewMsgClient(cc grpc1.ClientConn) MsgClient {
	return &msgClient{cc}
}

func (c *msgClient) Mint(ctx context.Context, in *MsgMint, opts ...grpc.CallOption) (*MsgMintResponse, error) {
	out := new(MsgMintResponse)
	err := c.cc.Invoke(ctx, "/iconlake.icon.Msg/Mint", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *msgClient) UpdateClass(ctx context.Context, in *MsgUpdateClass, opts ...grpc.CallOption) (*MsgUpdateClassResponse, error) {
	out := new(MsgUpdateClassResponse)
	err := c.cc.Invoke(ctx, "/iconlake.icon.Msg/UpdateClass", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// MsgServer is the server API for Msg service.
type MsgServer interface {
	Mint(context.Context, *MsgMint) (*MsgMintResponse, error)
	UpdateClass(context.Context, *MsgUpdateClass) (*MsgUpdateClassResponse, error)
}

// UnimplementedMsgServer can be embedded to have forward compatible implementations.
type UnimplementedMsgServer struct {
}

func (*UnimplementedMsgServer) Mint(ctx context.Context, req *MsgMint) (*MsgMintResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Mint not implemented")
}
func (*UnimplementedMsgServer) UpdateClass(ctx context.Context, req *MsgUpdateClass) (*MsgUpdateClassResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateClass not implemented")
}

func RegisterMsgServer(s grpc1.Server, srv MsgServer) {
	s.RegisterService(&_Msg_serviceDesc, srv)
}

func _Msg_Mint_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgMint)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).Mint(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/iconlake.icon.Msg/Mint",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).Mint(ctx, req.(*MsgMint))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_UpdateClass_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgUpdateClass)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).UpdateClass(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/iconlake.icon.Msg/UpdateClass",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).UpdateClass(ctx, req.(*MsgUpdateClass))
	}
	return interceptor(ctx, in, info, handler)
}

var _Msg_serviceDesc = grpc.ServiceDesc{
	ServiceName: "iconlake.icon.Msg",
	HandlerType: (*MsgServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Mint",
			Handler:    _Msg_Mint_Handler,
		},
		{
			MethodName: "UpdateClass",
			Handler:    _Msg_UpdateClass_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "iconlake/icon/tx.proto",
}

func (m *MsgMint) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *MsgMint) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *MsgMint) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.Supply != 0 {
		i = encodeVarintTx(dAtA, i, uint64(m.Supply))
		i--
		dAtA[i] = 0x48
	}
	if len(m.UriHash) > 0 {
		i -= len(m.UriHash)
		copy(dAtA[i:], m.UriHash)
		i = encodeVarintTx(dAtA, i, uint64(len(m.UriHash)))
		i--
		dAtA[i] = 0x3a
	}
	if len(m.Uri) > 0 {
		i -= len(m.Uri)
		copy(dAtA[i:], m.Uri)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Uri)))
		i--
		dAtA[i] = 0x32
	}
	if len(m.Description) > 0 {
		i -= len(m.Description)
		copy(dAtA[i:], m.Description)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Description)))
		i--
		dAtA[i] = 0x2a
	}
	if len(m.Name) > 0 {
		i -= len(m.Name)
		copy(dAtA[i:], m.Name)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Name)))
		i--
		dAtA[i] = 0x22
	}
	if len(m.Id) > 0 {
		i -= len(m.Id)
		copy(dAtA[i:], m.Id)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Id)))
		i--
		dAtA[i] = 0x1a
	}
	if len(m.ClassId) > 0 {
		i -= len(m.ClassId)
		copy(dAtA[i:], m.ClassId)
		i = encodeVarintTx(dAtA, i, uint64(len(m.ClassId)))
		i--
		dAtA[i] = 0x12
	}
	if len(m.Creator) > 0 {
		i -= len(m.Creator)
		copy(dAtA[i:], m.Creator)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Creator)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func (m *MsgMintResponse) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *MsgMintResponse) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *MsgMintResponse) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	return len(dAtA) - i, nil
}

func (m *MsgUpdateClass) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *MsgUpdateClass) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *MsgUpdateClass) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.UriHash) > 0 {
		i -= len(m.UriHash)
		copy(dAtA[i:], m.UriHash)
		i = encodeVarintTx(dAtA, i, uint64(len(m.UriHash)))
		i--
		dAtA[i] = 0x3a
	}
	if len(m.Uri) > 0 {
		i -= len(m.Uri)
		copy(dAtA[i:], m.Uri)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Uri)))
		i--
		dAtA[i] = 0x32
	}
	if len(m.Description) > 0 {
		i -= len(m.Description)
		copy(dAtA[i:], m.Description)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Description)))
		i--
		dAtA[i] = 0x2a
	}
	if len(m.Symbol) > 0 {
		i -= len(m.Symbol)
		copy(dAtA[i:], m.Symbol)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Symbol)))
		i--
		dAtA[i] = 0x22
	}
	if len(m.Name) > 0 {
		i -= len(m.Name)
		copy(dAtA[i:], m.Name)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Name)))
		i--
		dAtA[i] = 0x1a
	}
	if len(m.Id) > 0 {
		i -= len(m.Id)
		copy(dAtA[i:], m.Id)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Id)))
		i--
		dAtA[i] = 0x12
	}
	if len(m.Creator) > 0 {
		i -= len(m.Creator)
		copy(dAtA[i:], m.Creator)
		i = encodeVarintTx(dAtA, i, uint64(len(m.Creator)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func (m *MsgUpdateClassResponse) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *MsgUpdateClassResponse) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *MsgUpdateClassResponse) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	return len(dAtA) - i, nil
}

func encodeVarintTx(dAtA []byte, offset int, v uint64) int {
	offset -= sovTx(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *MsgMint) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.Creator)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.ClassId)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.Id)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.Name)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.Description)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.Uri)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.UriHash)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	if m.Supply != 0 {
		n += 1 + sovTx(uint64(m.Supply))
	}
	return n
}

func (m *MsgMintResponse) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	return n
}

func (m *MsgUpdateClass) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.Creator)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.Id)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.Name)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.Symbol)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.Description)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.Uri)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	l = len(m.UriHash)
	if l > 0 {
		n += 1 + l + sovTx(uint64(l))
	}
	return n
}

func (m *MsgUpdateClassResponse) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	return n
}

func sovTx(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozTx(x uint64) (n int) {
	return sovTx(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *MsgMint) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowTx
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: MsgMint: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: MsgMint: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Creator", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Creator = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field ClassId", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.ClassId = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 3:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Id", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Id = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 4:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Name", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Name = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 5:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Description", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Description = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 6:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Uri", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Uri = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 7:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field UriHash", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.UriHash = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 9:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field Supply", wireType)
			}
			m.Supply = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.Supply |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		default:
			iNdEx = preIndex
			skippy, err := skipTx(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthTx
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func (m *MsgMintResponse) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowTx
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: MsgMintResponse: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: MsgMintResponse: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		default:
			iNdEx = preIndex
			skippy, err := skipTx(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthTx
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func (m *MsgUpdateClass) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowTx
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: MsgUpdateClass: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: MsgUpdateClass: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Creator", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Creator = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Id", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Id = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 3:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Name", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Name = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 4:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Symbol", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Symbol = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 5:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Description", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Description = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 6:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Uri", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Uri = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 7:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field UriHash", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowTx
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthTx
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthTx
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.UriHash = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipTx(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthTx
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func (m *MsgUpdateClassResponse) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowTx
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: MsgUpdateClassResponse: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: MsgUpdateClassResponse: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		default:
			iNdEx = preIndex
			skippy, err := skipTx(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthTx
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func skipTx(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowTx
			}
			if iNdEx >= l {
				return 0, io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= (uint64(b) & 0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		wireType := int(wire & 0x7)
		switch wireType {
		case 0:
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowTx
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				iNdEx++
				if dAtA[iNdEx-1] < 0x80 {
					break
				}
			}
		case 1:
			iNdEx += 8
		case 2:
			var length int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowTx
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				length |= (int(b) & 0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if length < 0 {
				return 0, ErrInvalidLengthTx
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupTx
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthTx
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthTx        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowTx          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupTx = fmt.Errorf("proto: unexpected end of group")
)