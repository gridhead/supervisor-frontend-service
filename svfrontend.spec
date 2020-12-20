%global srcname supervisor-frontend-service

Name:           svfrontend
Version:        1.0.2
Release:        1%{?dist}
Summary:        SuperVisor Frontend Service

License:        GPLv3+
URL:            http://github.com/t0xic0der/%{srcname}
Source0:        https://github.com/t0xic0der/%{srcname}/archive/%{name}-%{version}.tar.gz

BuildArch:      noarch

BuildRequires:  python3-devel
BuildRequires:  python3-setuptools

%description
Reference frontend service for SuperVisor written in Flask

%prep
%autosetup

%build
%py3_build

%install
%py3_install

%files
%license LICENSE
%doc README.md
%{_bindir}/%{name}
%{python3_sitelib}/%{name}-*.egg-info/
%{python3_sitelib}/%{name}/

%changelog
* Fri Dec 18 2020 Akashdeep Dhar <t0xic0der@fedoraproject.org>
- Initial packaged release
