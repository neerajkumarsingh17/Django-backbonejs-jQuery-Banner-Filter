from edxmako.shortcuts import render_to_response, render_to_string, marketing_link
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from openedx.core.lib.api.paginators import NamespacedPageNumberPagination
from rest_framework import permissions
from rest_framework import generics
from rest_framework.response import Response
from resources.models import ContentPartner, Grade, Subject, FileTypes, Resource, ResourceBanner
from dateutil import rrule
from datetime import datetime, date
from django.http import Http404 
from rest_framework import status
from django.db.models import Q

from resources import serializers


@login_required
def resources_dashboard(request):
    return render_to_response("resources/dashboard.html", {})


class ContentPartnerList(generics.ListAPIView):
    queryset = ContentPartner.objects.all()
    serializer_class = serializers.ContentPartnerSerializer
    pagination_class = NamespacedPageNumberPagination
    permission_classes = (permissions.IsAuthenticated,)

class GradeList(generics.ListAPIView):
    queryset = Grade.objects.all()
    serializer_class = serializers.GradeSerializer
    pagination_class = NamespacedPageNumberPagination
    permission_classes = (permissions.IsAuthenticated,)

class SubjectList(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = serializers.SubjectSerializer
    pagination_class = NamespacedPageNumberPagination
    permission_classes = (permissions.IsAuthenticated,)

class FileTypesList(generics.ListAPIView):
    queryset = FileTypes.objects.all()
    serializer_class = serializers.FileTypesSerializer
    pagination_class = NamespacedPageNumberPagination
    permission_classes = (permissions.IsAuthenticated,)

class ResourceList(generics.ListAPIView):
    serializer_class = serializers.ResourceSerializer
    pagination_class = NamespacedPageNumberPagination
    # permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        request_data = self.request.GET

        result = Resource.objects.all()

        if 'search_param' in request_data:
            search_param = request_data.get('search_param')
            result = result.filter(
                    Q(name__icontains = search_param) |
                    Q(description__icontains = search_param)
                )

        

        content_partner = request_data.get('content_partner', None) # cp1, cp2
        subject = request_data.get('subject', None) # s1, s2
        grade = request_data.get('grade', None) #g1, g2

        """
        logic:
            query cp1
        """

        base_q = Q()
        if content_partner:
            content_partner = content_partner.split(',')
            base_q &= Q(content_partner__pk__in = content_partner)
        if subject:
            subject = subject.split(',')
            base_q &= Q(subject__pk__in=subject)
        if grade:
            grade = grade.split(',')
            base_q &= Q(grade__pk__in=grade)

        if base_q is not None:
            result = result.filter(
                base_q
            )

        return result


class Summary(generics.ListAPIView):

    #permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):

        content_partner = ContentPartner.objects.all()
        content_partner_data = []
        for content_partner_obj in content_partner:
            serializer = serializers.ContentPartnerSerializer(content_partner_obj)
            content_partner_data.append(serializer.data)

        grade = Grade.objects.all()
        grade_data = []
        for grade_obj in grade:
            serializer = serializers.GradeSerializer(grade_obj)
            grade_data.append(serializer.data)

        subject = Subject.objects.all()
        subject_data = []
        for subject_obj in subject:
            serializer = serializers.SubjectSerializer(subject_obj)
            subject_data.append(serializer.data)

        file_types = FileTypes.objects.all()
        file_types_data = []
        for file_types_obj in file_types:
            serializer = serializers.FileTypesSerializer(file_types_obj)
            file_types_data.append(serializer.data)

        context_data = {
            "grade" : grade_data,
            "subject": subject_data,
            "content_type": file_types_data,
            "content_partner": content_partner_data
        }

        return Response(context_data)

class Banner(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset= ResourceBanner.objects.all()  
    serializer_class=serializers.ResourceBannerSerializer

    # def get(self, request):
    #     import pdb; pdb.set_trace()
    #     banner_ = ResourceBanner.objects.all()  
    #     banner_data = []
    #     for banner_image in banner_:
    #         print(banner_image)
    #         serializers = serializers.ResourceBannerSerializer(banner_image)
    #         banner_data.append(serializers.data)
    #         return banner_data
